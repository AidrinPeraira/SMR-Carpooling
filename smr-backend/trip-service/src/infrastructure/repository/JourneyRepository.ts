import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { JourneyEntity, JourneyStop } from "#/domain/entities/JourneyEntity";
import { JourneyPassengerEntity } from "#/domain/entities/JourneyPassenger";
import { prisma } from "#/infrastructure/database/prisma";
import {
  JourneyStatus,
  PassengerJourneyStatus,
  StopType,
  TripStop,
} from "@sharemyride/shared";

/**
 * This class implements the repository that
 * handles persistance for the journey aggregation root. (Journey, Journey Passenger, Journey Stop)
 */
export class JourneyRepository implements IJourneyRepository {
  private readonly _journeyModel = prisma.journey;
  private readonly _journeyPassengerModel = prisma.journeyPassenger;

  /**
   * Creates a journey, its passengers, and its stops
   * in a single transaction. Rolls back all three
   * if any insert fails.
   *
   * @param journey : Journey entity with intermediate stops
   * @param journeyPassengers : Passengers to register for the journey
   * @returns Created journey and passengers
   */
  async createJourney(
    journey: JourneyEntity,
    journeyPassengers: JourneyPassengerEntity[],
  ): Promise<{
    journey: JourneyEntity;
    journeyPassengers: JourneyPassengerEntity[];
  }> {
    const result = await prisma.$transaction(async (tx) => {
      const createdJourney = await tx.journey.create({
        data: {
          journeyId: journey.journeyId,
          driverId: journey.driverId,
          origin: journey.origin as any,
          destination: journey.destination as any,
          journeyStatus: journey.journeyStatus,
        },
      });

      const createdPassengers = await Promise.all(
        journeyPassengers.map((jp) =>
          tx.journeyPassenger.create({
            data: {
              journeyId: jp.journeyId,
              passengerId: jp.passengerId,
              passengerName: jp.passengerName,
              bookingId: jp.bookingId,
              passengerStatus: jp.passengerStatus,
              pickupLocation: jp.pickupLocation as any,
              dropOffLocation: jp.dropOffLocation as any,
              pickupOTP: jp.pickupOTP,
              pickupVerified: jp.pickupVerified,
            },
          }),
        ),
      );

      const createdStops = await Promise.all(
        journey.intermediateStops.map((stop) =>
          tx.journeyStop.create({
            data: {
              journeyId: journey.journeyId,
              passengerId: stop.passengerId,
              stopType: stop.stopType,
              stopLat: stop.stopLat,
              stopLng: stop.stopLng,
              stopName: stop.stopName,
              stopAddress: stop.stopAddress,
            },
          }),
        ),
      );

      return { createdJourney, createdPassengers, createdStops };
    });

    return {
      journey: this._toJourneyEntity(
        result.createdJourney,
        result.createdStops,
      ),
      journeyPassengers: result.createdPassengers.map(this._toPassengerEntity),
    };
  }

  /**
   * Finds the most recent journey a passenger
   * is part of, along with their passenger record.
   *
   * @param passengerId : ID of the passenger
   * @returns Journey and passenger record, or null
   */
  async findJourneyByPassengerId(passengerId: string): Promise<{
    journey: JourneyEntity;
    journeyPassenger: JourneyPassengerEntity;
  } | null> {
    const journeyPassenger = await this._journeyPassengerModel.findFirst({
      where: { passengerId },
      include: {
        journey: {
          include: { stops: true },
        },
      },
      orderBy: { journey: { createdAt: "desc" } },
    });

    if (!journeyPassenger) return null;

    return {
      journey: this._toJourneyEntity(
        journeyPassenger.journey,
        journeyPassenger.journey.stops,
      ),
      journeyPassenger: this._toPassengerEntity(journeyPassenger),
    };
  }

  /**
   * Finds a journey by its ID with all
   * passengers and stops included.
   *
   * @param journeyId : ID of the journey (same as tripId)
   * @returns Journey with passengers, or null
   */
  async findJourneyById(journeyId: string): Promise<{
    journey: JourneyEntity;
    journeyPassengers: JourneyPassengerEntity[];
  } | null> {
    const journey = await this._journeyModel.findUnique({
      where: { journeyId },
      include: {
        passengers: {
          include: { booking: true },
        },
        stops: true,
      },
    });

    if (!journey) return null;

    const stopPlaceMap = new Map<string, string>();
    const placeIds: string[] = [];
    for (const p of journey.passengers) {
      stopPlaceMap.set(`${p.passengerId}:pickup`, p.booking.pickupPlaceId);
      stopPlaceMap.set(`${p.passengerId}:dropoff`, p.booking.dropOffPlaceId);
      placeIds.push(p.booking.pickupPlaceId, p.booking.dropOffPlaceId);
    }

    const tripPlaces = await prisma.tripPlaces.findMany({
      where: { tripId: journeyId, placeIndex: { in: placeIds } },
    });

    const placeSeqMap = new Map<string, number>();
    for (const tp of tripPlaces) {
      placeSeqMap.set(tp.placeIndex, tp.seqNumber);
    }

    const sortedStops = [...journey.stops].sort((a, b) => {
      const aPlaceId = stopPlaceMap.get(`${a.passengerId}:${a.stopType}`);
      const bPlaceId = stopPlaceMap.get(`${b.passengerId}:${b.stopType}`);
      const aSeq = aPlaceId ? (placeSeqMap.get(aPlaceId) ?? 0) : 0;
      const bSeq = bPlaceId ? (placeSeqMap.get(bPlaceId) ?? 0) : 0;
      return aSeq - bSeq;
    });

    return {
      journey: this._toJourneyEntity(journey, sortedStops),
      journeyPassengers: journey.passengers.map(this._toPassengerEntity),
    };
  }

  /**
   * Partially updates a journey record
   * (status, origin, destination).
   *
   * @param journeyId : ID of the journey to update
   * @param journey : Fields to update
   * @returns Updated journey entity
   */
  async updateJourney(
    journeyId: string,
    journey: Partial<JourneyEntity>,
  ): Promise<JourneyEntity> {
    const updateData: Record<string, any> = {};

    if (journey.journeyStatus !== undefined)
      updateData.journeyStatus = journey.journeyStatus;
    if (journey.origin !== undefined) updateData.origin = journey.origin as any;
    if (journey.destination !== undefined)
      updateData.destination = journey.destination as any;

    const updated = await this._journeyModel.update({
      where: { journeyId },
      data: updateData,
      include: { stops: true },
    });

    return this._toJourneyEntity(updated, updated.stops);
  }

  /**
   * Partially updates a journey passenger record
   * using the composite key (journeyId + passengerId).
   *
   * @param journeyId : ID of the journey
   * @param passengerId : ID of the passenger
   * @param journeyPassenger : Fields to update
   * @returns Updated journey passenger entity
   */
  async updateJourneyPassenger(
    journeyId: string,
    passengerId: string,
    journeyPassenger: Partial<JourneyPassengerEntity>,
  ): Promise<JourneyPassengerEntity> {
    const updateData: Record<string, any> = {};

    if (journeyPassenger.passengerStatus !== undefined)
      updateData.passengerStatus = journeyPassenger.passengerStatus;
    if (journeyPassenger.pickupOTP !== undefined)
      updateData.pickupOTP = journeyPassenger.pickupOTP;
    if (journeyPassenger.pickupTime !== undefined)
      updateData.pickupTime = journeyPassenger.pickupTime;
    if (journeyPassenger.dropoffTime !== undefined)
      updateData.dropoffTime = journeyPassenger.dropoffTime;
    if (journeyPassenger.pickupVerified !== undefined)
      updateData.pickupVerified = journeyPassenger.pickupVerified;

    const updated = await this._journeyPassengerModel.update({
      where: {
        journeyId_passengerId: { journeyId, passengerId },
      },
      data: updateData,
    });

    return this._toPassengerEntity(updated);
  }

  /**
   * Finds a single journey passenger record
   * by the composite key (journeyId + passengerId).
   *
   * @param journeyId : ID of the journey
   * @param passengerId : ID of the passenger
   * @returns Journey passenger entity, or null
   */
  async findJourneyPassenger(
    journeyId: string,
    passengerId: string,
  ): Promise<JourneyPassengerEntity | null> {
    const record = await this._journeyPassengerModel.findUnique({
      where: {
        journeyId_passengerId: { journeyId, passengerId },
      },
    });

    if (!record) return null;

    return this._toPassengerEntity(record);
  }

  /**
   * Updates a journey stop record using the
   * composite key (journeyId + passengerId + stopType).
   *
   * @param journeyId : ID of the journey
   * @param passengerId : ID of the passenger the stop belongs to
   * @param stopType : PICKUP or DROPOFF
   * @param stop : Fields to update (arrivedAt, arrivedLat, arrivedLng, departedAt)
   */
  async updateJourneyStop(
    journeyId: string,
    passengerId: string,
    stopType: string,
    stop: Partial<JourneyStop>,
  ): Promise<void> {
    const updateData: Record<string, any> = {};

    if (stop.arrivedAt !== undefined) updateData.arrivedAt = stop.arrivedAt;
    if (stop.departedAt !== undefined) updateData.departedAt = stop.departedAt;
    if (stop.arrivedLat !== undefined) updateData.arrivedLat = stop.arrivedLat;
    if (stop.arrivedLng !== undefined) updateData.arrivedLng = stop.arrivedLng;

    await prisma.journeyStop.update({
      where: {
        journeyId_passengerId_stopType: {
          journeyId,
          passengerId,
          stopType: stopType as StopType,
        },
      },
      data: updateData,
    });
  }

  /** Maps a Prisma Journey + JourneyStop[] to a JourneyEntity. */
  private _toJourneyEntity(journey: any, stops: any[]): JourneyEntity {
    const intermediateStops: JourneyStop[] = stops.map((s: any) => ({
      stopLat: s.stopLat,
      stopLng: s.stopLng,
      stopName: s.stopName,
      stopAddress: s.stopAddress,
      arrivedAt: s.arrivedAt,
      departedAt: s.departedAt,
      passengerId: s.passengerId,
      stopType: s.stopType as StopType,
      arrivedLat: s.arrivedLat,
      arrivedLng: s.arrivedLng,
    }));

    return {
      journeyId: journey.journeyId,
      driverId: journey.driverId,
      origin: journey.origin as unknown as TripStop,
      destination: journey.destination as unknown as TripStop,
      intermediateStops,
      journeyStatus: journey.journeyStatus as JourneyStatus,
      createdAt: journey.createdAt,
      updatedAt: journey.updatedAt,
    };
  }

  /** Maps a Prisma JourneyPassenger record to a JourneyPassengerEntity. */
  private _toPassengerEntity(record: any): JourneyPassengerEntity {
    return {
      passengerId: record.passengerId,
      passengerName: record.passengerName,
      journeyId: record.journeyId,
      bookingId: record.bookingId,
      passengerStatus: record.passengerStatus as PassengerJourneyStatus,
      pickupLocation: record.pickupLocation as unknown as TripStop,
      dropOffLocation: record.dropOffLocation as unknown as TripStop,
      pickupOTP: record.pickupOTP,
      pickupTime: record.pickupTime,
      dropoffTime: record.dropoffTime,
      pickupVerified: record.pickupVerified,
    };
  }
}
