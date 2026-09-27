import { IJourneyPassengerRepository } from "#/application/interfaces/repository/IJourneyPassengerRepository";
import { JourneyPassengerEntity } from "#/domain/entities/JourneyPassengerEntity";
import { prisma } from "#/infrastructure/database/prisma";
import { Prisma } from "#/infrastructure/database/generated/prisma/client";
import { PassengerRideStatus, TripStop } from "@sharemyride/shared";

interface JourneyPassengerRecord {
  journeyPassengerId: string;
  passengerId: string;
  passengerName: string;
  journeyId: string;
  bookingId: string;
  passengerStatus: string;
  pickupLocation: unknown;
  dropOffLocation: unknown;
  pickupOTP: string | null;
  pickupTime: Date | null;
  dropoffTime: Date | null;
  pickupVerified: boolean;
}

/**
 * This class implements the repository that handles database
 * operations on the passengers of a live journey.
 */
export class JourneyPassengerRepository implements IJourneyPassengerRepository {
  private readonly _journeyPassengerModel = prisma.journeyPassenger;

  constructor() {}

  /**
   * Creates a new journey passenger record for a confirmed booking
   *
   * @param journeyPassenger Journey passenger entity
   */
  async save(
    journeyPassenger: JourneyPassengerEntity,
  ): Promise<JourneyPassengerEntity> {
    const created = await this._journeyPassengerModel.create({
      data: {
        journeyPassengerId: journeyPassenger.journeyPassengerId,
        passengerId: journeyPassenger.passengerId,
        passengerName: journeyPassenger.passengerName,
        journeyId: journeyPassenger.journeyId,
        bookingId: journeyPassenger.bookingId,
        passengerStatus: journeyPassenger.passengerStatus,
        pickupLocation:
          journeyPassenger.pickupLocation as unknown as Prisma.InputJsonValue,
        dropOffLocation:
          journeyPassenger.dropOffLocation as unknown as Prisma.InputJsonValue,
        pickupOTP: journeyPassenger.pickupOTP,
        pickupTime: journeyPassenger.pickupTime,
        dropoffTime: journeyPassenger.dropoffTime,
        pickupVerified: journeyPassenger.pickupVerified,
      },
    });

    return this._toEntity(created);
  }

  /**
   * Updates fields of a journey passenger by journeyPassengerId
   *
   * @param journeyPassengerId Journey passenger ID
   * @param data Fields to update
   */
  async updateById(
    journeyPassengerId: string,
    data: Partial<JourneyPassengerEntity>,
  ): Promise<JourneyPassengerEntity> {
    const updateData: Prisma.JourneyPassengerUpdateInput = {};

    if (data.passengerName !== undefined)
      updateData.passengerName = data.passengerName;
    if (data.passengerStatus !== undefined)
      updateData.passengerStatus = data.passengerStatus;
    if (data.pickupLocation !== undefined)
      updateData.pickupLocation =
        data.pickupLocation as unknown as Prisma.InputJsonValue;
    if (data.dropOffLocation !== undefined)
      updateData.dropOffLocation =
        data.dropOffLocation as unknown as Prisma.InputJsonValue;
    if (data.pickupOTP !== undefined) updateData.pickupOTP = data.pickupOTP;
    if (data.pickupTime !== undefined) updateData.pickupTime = data.pickupTime;
    if (data.dropoffTime !== undefined)
      updateData.dropoffTime = data.dropoffTime;
    if (data.pickupVerified !== undefined)
      updateData.pickupVerified = data.pickupVerified;

    const updated = await this._journeyPassengerModel.update({
      where: { journeyPassengerId },
      data: updateData,
    });

    return this._toEntity(updated);
  }

  /**
   * Finds a single journey passenger by journeyPassengerId
   *
   * @param journeyPassengerId Journey passenger ID
   */
  async findById(
    journeyPassengerId: string,
  ): Promise<JourneyPassengerEntity | null> {
    const journeyPassenger = await this._journeyPassengerModel.findUnique({
      where: { journeyPassengerId },
    });

    if (!journeyPassenger) return null;

    return this._toEntity(journeyPassenger);
  }

  /**
   * Maps a journey passenger database record to the entity
   */
  private _toEntity(
    record: JourneyPassengerRecord,
  ): JourneyPassengerEntity {
    return {
      journeyPassengerId: record.journeyPassengerId,
      passengerId: record.passengerId,
      passengerName: record.passengerName,
      journeyId: record.journeyId,
      bookingId: record.bookingId,
      passengerStatus: record.passengerStatus as PassengerRideStatus,
      pickupLocation: record.pickupLocation as TripStop,
      dropOffLocation: record.dropOffLocation as TripStop,
      pickupOTP: record.pickupOTP,
      pickupTime: record.pickupTime,
      dropoffTime: record.dropoffTime,
      pickupVerified: record.pickupVerified,
    };
  }
}
