import crypto from "node:crypto";
import { CreateTripRequestDTO } from "#/application/dto/trip/CreateTripRequestDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { ICreateTripUseCase } from "#/application/interfaces/use-case/trip/ICreateTripUseCase";
import { TripEntity } from "#/domain/entities/TripEntity";
import { TripStatus } from "@sharemyride/shared";

/**
 * Use case responsible for orchestrating trip creation logic
 * and saving the new trip entity via the trip repository.
 */
export class CreateTripUseCase implements ICreateTripUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  async execute(data: CreateTripRequestDTO): Promise<void> {
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
  }
}
