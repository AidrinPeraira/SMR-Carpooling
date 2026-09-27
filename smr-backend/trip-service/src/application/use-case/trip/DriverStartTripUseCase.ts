import crypto from "node:crypto";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { IJourneyPassengerRepository } from "#/application/interfaces/repository/IJourneyPassengerRepository";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import {
  BookingEntityWithPassenger,
  ITripRepository,
} from "#/application/interfaces/repository/ITripRepository";
import { IDriverStartTripUseCase } from "#/application/interfaces/use-case/trip/IDriverStartTripUseCase";
import { JourneyEntity } from "#/domain/entities/JourneyEntity";
import { JourneyPassengerEntity } from "#/domain/entities/JourneyPassengerEntity";
import {
  ApplicationError,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  JourneyStop,
  PassengerRideStatus,
  StopType,
  TripErrorMessage,
  TripStatus,
  UserErrorMessage,
} from "@sharemyride/shared";

/**
 * This class implements the usecase that handles starting a new trip
 * and creating new journey and journey passengers
 */
export class DriverStartTripUseCase implements IDriverStartTripUseCase {
  constructor(
    private readonly _driverRepo: IDriverRepository,
    private readonly _tripRepo: ITripRepository,
    private readonly _passengerRepo: IPassengerRepository,
    private readonly _journeyRepo: IJourneyRepository,
    private readonly _journeyPassengerRepo: IJourneyPassengerRepository,
  ) {}

  /**
   * @param tripId : ID of the trip as string
   * @param driverId : ID of the driver (userId)
   */
  async execute(tripId: string, driverId: string): Promise<void> {
    //verify driver exists or throw an application error
    const driver = await this._driverRepo.findByDriverId(driverId);
    if (!driver) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverStartTripUseCase",
          description: `Driver not found with driverId: ${driverId}`,
        },
      );
    }

    //verify trip exists or throw a not found error
    const tripDetails = await this._tripRepo.findTripDetails(tripId);
    if (!tripDetails || !tripDetails.tripDetails) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverStartTripUseCase",
          description: `Trip not found with tripId: ${tripId}`,
        },
      );
    }

    const trip = tripDetails.tripDetails;

    if (trip.driverId !== driverId) {
      throw new ApplicationError(
        TripErrorMessage.UNAUTHORIZED_START,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverStartTripUseCase",
          description: `Trip does not belong to driver: ${driverId}`,
        },
      );
    }

    //only a scheduled or fully booked trip can be started
    if (
      trip.tripStatus !== TripStatus.SCHEDULED &&
      trip.tripStatus !== TripStatus.FULLY_BOOKED
    ) {
      throw new ApplicationError(
        trip.tripStatus === TripStatus.ONGOING
          ? TripErrorMessage.ALREADY_STARTED
          : TripErrorMessage.CANNOT_START,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverStartTripUseCase",
          description: `Trip status is '${trip.tripStatus}', expected '${TripStatus.SCHEDULED}' or '${TripStatus.FULLY_BOOKED}'`,
        },
      );
    }

    //the trip can only start on the trip date
    if (trip.startTime.toDateString() !== new Date().toDateString()) {
      throw new ApplicationError(
        TripErrorMessage.NOT_TRIP_DATE,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverStartTripUseCase",
          description: `Trip is scheduled for ${trip.startTime.toISOString()} and cannot be started today`,
        },
      );
    }

    //a started trip already has a journey
    const existingJourney = await this._journeyRepo.findById(tripId);
    if (existingJourney) {
      throw new ApplicationError(
        TripErrorMessage.ALREADY_STARTED,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "DriverStartTripUseCase",
          description: `A journey already exists for tripId: ${tripId}`,
        },
      );
    }

    //find confirmed bookings for trip
    const confirmedBookings = (tripDetails.bookingDetails || []).filter(
      (booking) => booking.status === BookingStatus.CONFIRMED,
    );

    //create jouney
    const placeSequence = await this._tripRepo.findTripPlaceSequence(tripId);
    const now = new Date();
    const journey: JourneyEntity = {
      journeyId: trip.tripId,
      driverId: trip.driverId,
      origin: trip.tripOrigin,
      destination: trip.tripDestination,
      intermediateStops: this._orderStops(confirmedBookings, placeSequence),
      journeyStatus: TripStatus.ONGOING,
      createdAt: now,
      updatedAt: now,
    };

    await this._journeyRepo.save(journey);

    //create journey passengers
    for (const booking of confirmedBookings) {
      const passenger = await this._passengerRepo.findByPassengerId(
        booking.passengerId,
      );

      const journeyPassenger: JourneyPassengerEntity = {
        journeyPassengerId: crypto.randomUUID(),
        passengerId: booking.passengerId,
        passengerName: passenger
          ? `${passenger.firstName} ${passenger.lastName}`.trim()
          : booking.passengerName || "Passenger",
        journeyId: journey.journeyId,
        bookingId: booking.bookingId,
        passengerStatus: PassengerRideStatus.WAITING,
        pickupLocation: booking.pickupPoint,
        dropOffLocation: booking.dropOffPoint,
        pickupOTP: crypto.randomInt(100000, 999999).toString(),
        pickupTime: null,
        dropoffTime: null,
        pickupVerified: false,
      };

      await this._journeyPassengerRepo.save(journeyPassenger);
    }

    //it updates the trip status as active
    await this._tripRepo.update(trip.tripId, {
      tripStatus: TripStatus.ONGOING,
    });
  }

  /**
   * Builds the pickup and drop off stops of every confirmed booking and puts
   * them in the order the driver will reach them along the trip route. The
   * place of every booking stop is already indexed in TripPlaces, so its
   * sequence number on the route gives the order.
   *
   * @param bookings Confirmed bookings of the trip
   * @param placeSequence Map of place index to its sequence number on the route
   */
  private _orderStops(
    bookings: BookingEntityWithPassenger[],
    placeSequence: Map<string, number>,
  ): JourneyStop[] {
    const stops: { stop: JourneyStop; routePosition: number }[] = [];

    for (const booking of bookings) {
      const bookingStops = [
        {
          point: booking.pickupPoint,
          placeId: booking.pickupPlaceId,
          stopType: StopType.PICKUP,
        },
        {
          point: booking.dropOffPoint,
          placeId: booking.dropOffPlaceId,
          stopType: StopType.DROP_OFF,
        },
      ];

      for (const { point, placeId, stopType } of bookingStops) {
        stops.push({
          //an unindexed place is kept last instead of dropping the stop
          routePosition: placeSequence.get(placeId) ?? Number.MAX_SAFE_INTEGER,
          stop: {
            stopLat: point.stopLat,
            stopLng: point.stopLng,
            stopName: point.stopName,
            stopAddress: point.stopAddress,
            arrivedAt: null,
            departedAt: null,
            passengerId: booking.passengerId,
            stopType,
          },
        });
      }
    }

    stops.sort((a, b) => {
      //the stop earliest on the route comes first
      if (a.routePosition !== b.routePosition) {
        return a.routePosition - b.routePosition;
      }
      //a passenger is picked up before being dropped off
      const rank = (stop: JourneyStop) =>
        stop.stopType === StopType.PICKUP ? 0 : 1;
      return rank(a.stop) - rank(b.stop);
    });

    const orderedStops = stops.map((s) => s.stop);

    //the indexed places are cell level, so correct any inverted pair
    for (const booking of bookings) {
      const pickupIndex = orderedStops.findIndex(
        (stop) =>
          stop.passengerId === booking.passengerId &&
          stop.stopType === StopType.PICKUP,
      );
      const dropOffIndex = orderedStops.findIndex(
        (stop) =>
          stop.passengerId === booking.passengerId &&
          stop.stopType === StopType.DROP_OFF,
      );

      const pickup = orderedStops[pickupIndex];
      const dropOff = orderedStops[dropOffIndex];

      if (pickup && dropOff && dropOffIndex < pickupIndex) {
        orderedStops[pickupIndex] = dropOff;
        orderedStops[dropOffIndex] = pickup;
      }
    }

    return orderedStops;
  }
}
