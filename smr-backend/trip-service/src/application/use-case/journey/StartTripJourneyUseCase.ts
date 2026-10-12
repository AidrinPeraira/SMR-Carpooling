import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import {
  BookingEntityWithPassenger,
  ITripRepository,
} from "#/application/interfaces/repository/ITripRepository";
import { IStartTripJourneyUseCase } from "#/application/interfaces/use-case/journey/IStartTripJourneyUseCase";
import { JourneyEntity, JourneyStop } from "#/domain/entities/JourneyEntity";
import { JourneyPassengerEntity } from "#/domain/entities/JourneyPassenger";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import {
  ApplicationError,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  JourneyErrorMessage,
  JourneyStartedEventPayload,
  JourneyStatus,
  PassengerJourneyStatus,
  StopType,
  TripStatus,
  TripStop,
} from "@sharemyride/shared";

export class StartTripJourneyUseCas implements IStartTripJourneyUseCase {
  constructor(
    private readonly _tripsRepository: ITripRepository,
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(tripId: string, driverId: string): Promise<void> {
    const tripPayload = await this._tripsRepository.findTripDetails(tripId);

    //validate the trip
    if (!tripPayload || !tripPayload.tripDetails) {
      throw new ApplicationError(
        JourneyErrorMessage.TRIP_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "StartTripJourneyUseCase",
          description: `Trip not found with tripId: ${tripId}`,
        },
      );
    }

    const trip = tripPayload.tripDetails;

    if (trip.driverId !== driverId) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_TRIP_DRIVER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "StartTripJourneyUseCase",
          description: `Trip does not belong to driver: ${driverId}`,
        },
      );
    }

    if (
      trip.tripStatus !== TripStatus.FULLY_BOOKED &&
      trip.tripStatus !== TripStatus.SCHEDULED
    ) {
      throw new ApplicationError(
        JourneyErrorMessage.CANNOT_START,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "StartTripJourneyUseCase",
          description: `Trip status is '${trip.tripStatus}', expected '${TripStatus.SCHEDULED}' or '${TripStatus.FULLY_BOOKED}'`,
        },
      );
    }

    //find confirmed bookings
    const confirmedBookings = tripPayload.bookingDetails.filter(
      (b) => b.status === BookingStatus.CONFIRMED,
    );

    if (confirmedBookings.length === 0) {
      throw new ApplicationError(
        JourneyErrorMessage.NO_CONFIRMED_BOOKINGS,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "StartTripJourneyUseCase",
          description: `No confirmed bookings for trip: ${tripId}`,
        },
      );
    }

    //build the stops in right order
    const journeyStops = this._buildOrderedStops(
      trip.tripStops, //origin and destination
      confirmedBookings, //intermediate stops
    );

    const journeyPassengers: JourneyPassengerEntity[] = confirmedBookings.map(
      (booking) => ({
        passengerId: booking.passengerId,
        passengerName: booking.passengerName || "Passenger",
        journeyId: tripId,
        bookingId: booking.bookingId,
        passengerStatus: PassengerJourneyStatus.NOT_BOARDED,
        pickupLocation: booking.pickupPoint,
        dropOffLocation: booking.dropOffPoint,
        pickupOTP: this._generateOTP(),
        pickupTime: null,
        dropoffTime: null,
        pickupVerified: false,
      }),
    );

    const now = new Date();

    const journey: JourneyEntity = {
      journeyId: tripId,
      driverId,
      origin: trip.tripOrigin,
      destination: trip.tripDestination,
      intermediateStops: journeyStops,
      journeyStatus: JourneyStatus.ONGOING,
      createdAt: now,
      updatedAt: now,
    };

    await this._journeyRepository.createJourney(journey, journeyPassengers);

    await this._tripsRepository.update(tripId, {
      tripStatus: TripStatus.ONGOING,
    });

    await this._eventBus.publish<JourneyStartedEventPayload>({
      eventName: EventName.JOURNEY_STARTED,
      timestamp: new Date(),
      payload: {
        journey_id: tripId,
        driver_id: driverId,
        passenger_ids: confirmedBookings.map((b) => b.passengerId),
      },
    });
  }

  /**
   * Creates a pickup + dropoff JourneyStop per booking,
   * then sorts them by their position in the trip's stop
   * sequence (pickups before dropoffs at the same stop).
   *
   * @param tripStops : All stops in the trip as array
   * @param bookings : Confirmed bookings with passenger details
   * @returns Ordered array of journey stops
   */
  private _buildOrderedStops(
    tripStops: TripStop[],
    bookings: BookingEntityWithPassenger[],
  ): JourneyStop[] {
    const stops: JourneyStop[] = [];

    for (const booking of bookings) {
      stops.push(
        this._toJourneyStop(
          booking.pickupPoint,
          booking.passengerId,
          StopType.PICKUP,
        ),
        this._toJourneyStop(
          booking.dropOffPoint,
          booking.passengerId,
          StopType.DROPOFF,
        ),
      );
    }

    stops.sort((a, b) => {
      const indexA = this._findStopIndex(tripStops, a);
      const indexB = this._findStopIndex(tripStops, b);
      if (indexA !== indexB) return indexA - indexB;
      if (a.stopType === StopType.PICKUP && b.stopType === StopType.DROPOFF)
        return -1;
      if (a.stopType === StopType.DROPOFF && b.stopType === StopType.PICKUP)
        return 1;
      return 0;
    });

    return stops;
  }

  /**
   * Maps a TripStop to a JourneyStop
   * with arrival/departure fields
   * initialised to null.
   *
   * @param stop : Trip Stop
   * @param passengerId : Id of passenger associated
   * @param stopType  : PICKUP | DROPOFF
   * @returns journey stop
   */
  private _toJourneyStop(
    stop: TripStop,
    passengerId: string,
    stopType: StopType,
  ): JourneyStop {
    return {
      stopLat: stop.stopLat,
      stopLng: stop.stopLng,
      stopName: stop.stopName,
      stopAddress: stop.stopAddress,
      arrivedAt: null,
      departedAt: null,
      passengerId,
      stopType,
      arrivedLat: null,
      arrivedLng: null,
    };
  }

  /**
   * Finds the position of a journey stop in the trip's
   * ordered stop list by matching coordinates.
   *
   * @param tripStops[] : All stops in the trip as array
   * @param stop : Particular stop to find index of when in order
   * @returns Index of "stop" when in order
   */
  private _findStopIndex(tripStops: TripStop[], stop: JourneyStop): number {
    const idx = tripStops.findIndex(
      (ts) => ts.stopLat === stop.stopLat && ts.stopLng === stop.stopLng,
    );
    return idx === -1 ? tripStops.length : idx;
  }

  /**
   * Generates a random 4-digit numeric OTP
   * for passenger pickup verification.
   */
  private _generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
