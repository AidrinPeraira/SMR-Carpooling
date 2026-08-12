import {
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/ListTripsDTO";
import { TripEntity } from "#/domain/entities/TripEntity";
import { PaginatedPayload, Route, VehicleTypes } from "@sharemyride/shared";

export interface JourneyDetailsPayload {
  trip: TripEntity;
  availableStops: Route;
  vehicleType: VehicleTypes;
}

/**
 * This repository handles creating trip records and the matching
 * trip places table for indexing using the geoIndexingService
 */
export interface ITripRepository {
  /**
   * Creates a new trip record and trip places records for all
   * places touched by the trip
   *
   * @param Trip data
   */
  save(trip: TripEntity): Promise<void>;

  /**
   * Match data with trips that match using the indexed tables
   *
   * @param Passnger Requirements Data
   * @return Pagianted result of matching trips
   */
  findMatchingTrips(
    dto: ListTripsRequestDTO,
  ): Promise<PaginatedPayload<ListTripsResultDTO[]>>;

  /**
   * Finds trip details with joined places coordinates from Places table
   *
   * @param tripId Trip ID
   * @return Journey details payload or null if not found
   */
  findJourneyDetails(tripId: string): Promise<JourneyDetailsPayload | null>;
}

