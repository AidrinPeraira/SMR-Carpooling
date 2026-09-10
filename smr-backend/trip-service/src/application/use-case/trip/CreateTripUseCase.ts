import crypto from "node:crypto";
import { CreateTripRequestDTO } from "#/application/dto/trip/CreateTripRequestDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { ICreateTripUseCase } from "#/application/interfaces/use-case/trip/ICreateTripUseCase";
import { TripEntity } from "#/domain/entities/TripEntity";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  NewTripEventPayload,
  TripStatus,
  UserErrorMessage,
} from "@sharemyride/shared";

import { EventName } from "@sharemyride/shared";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";

/**
 * Use case responsible for orchestrating trip creation logic
 * and saving the new trip entity via the trip repository.
 */
export class CreateTripUseCase implements ICreateTripUseCase {
  constructor(
    private readonly _tripRepository: ITripRepository,
    private readonly _driverRepository: IDriverRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(data: CreateTripRequestDTO): Promise<void> {
    const driver = await this._driverRepository.findByDriverId(data.driverId);
    if (!driver) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "Create trip use case",
          details: "Couldn't find driver with mathcing user id",
        },
      );
    }

    const scheduledTrips = await this._tripRepository.findTripsByDriverId(
      driver.driverId,
      {
        tripStatus: TripStatus.SCHEDULED,
      },
    );

    if (scheduledTrips.data.length > 0) {
      //check for trips starting on the same day
      const conflictingTrip = scheduledTrips.data.filter((v) => {
        const newTripDate = data.startTime;
        const oldTripDate = v.tripDetails.startTime;
        return (
          oldTripDate.getDate() == newTripDate.getDate() &&
          oldTripDate.getMonth() == newTripDate.getMonth() &&
          oldTripDate.getFullYear() == newTripDate.getFullYear()
        );
      });

      if (conflictingTrip.length > 0) {
        throw new ApplicationError(
          "A trip already exists for the same date",
          HttpStatusCodes.Conflict,
          ErrorCode.DOMAIN_CONFLICT,
          ErrorDetails.DOMAIN_CONFLICT,
          {
            location: "Create trip use case",
            details: "Driver has a trip for the same date",
          },
        );
      }
    }

    const now = new Date();
    const trip: TripEntity = {
      tripId: crypto.randomUUID(),
      driverId: data.driverId,
      vehicleId: data.vehicleId,
      tripOrigin: data.tripOrigin,
      tripDestination: data.tripDestination,
      tripStops: data.tripStops,
      tripRoute: data.tripRoute,
      tripDistance: data.tripDistance,
      availableSeats: data.availableSeats,
      vacantSeats: data.availableSeats,
      tripTags: data.tripTags,
      startTime: data.startTime,
      totalSeats: data.totalSeats,
      tripStatus: TripStatus.SCHEDULED,
      createdAt: now,
      updatedAt: now,
    };

    await this._tripRepository.save(trip);

    // Publish NewTripEvent
    await this._eventBus.publish<NewTripEventPayload>({
      eventName: EventName.TRIP_NEW_TRIP,
      timestamp: new Date(),
      payload: {
        tripId: trip.tripId,
        driverId: driver.driverId,
        driverName: `${driver.firstName} ${driver.lastName}`,
        driverEmail: driver.emailId,
        tripDate: trip.startTime,
      },
    });
  }
}
