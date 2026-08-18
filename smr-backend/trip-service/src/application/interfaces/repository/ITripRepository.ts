import {
  AdminGetAllTripsQuery,
  AdminGetAllTripsResponseDTO,
  AdminGetTripDetailsResponseDTO,
} from "#/application/dto/admin/AdminTripsDTO";
import { DriverGetAllTripsQueryDTO } from "#/application/dto/trip/DriverTripsDetailsDTO";
import {
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/PassengerListTripsDTO";
import { BookingEntity } from "#/domain/entities/BookingEntity";
import { TripEntity } from "#/domain/entities/TripEntity";
import { VehicleEntity } from "#/domain/entities/VehicleEntity";
import { PaginatedPayload, TripStop, VehicleTypes } from "@sharemyride/shared";

export interface JourneyDetailsPayload {
  trip: TripEntity;
  availableStops: TripStop[];
  vehicleType: VehicleTypes;
}

export interface BookingEntityWithPassenger extends BookingEntity {
  passengerName?: string;
}

export interface TripResultPayload {
  tripDetails: TripEntity;
  vehicleDetails: VehicleEntity;
  bookingDetails: BookingEntityWithPassenger[];
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
   * This method gets all the trip details with necessary joins
   *
   * @param tripId : id of trip as string
   */
  findTripDetails(tripId: string): Promise<TripResultPayload | null>;

  /**
   * Finds all trips created by a specific driver with pagination and status filtering
   *
   * @param driverId Driver ID
   * @param query Optional filtering and pagination params
   */
  findTripsByDriverId?(
    driverId: string,
    query?: DriverGetAllTripsQueryDTO,
  ): Promise<PaginatedPayload<TripResultPayload[]>>;

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

  /**
   * Finds a single trip entity by tripId
   *
   * @param tripId Trip ID
   */
  findByTripId(tripId: string): Promise<TripEntity | null>;

  /**
   * Updates fields of a trip by tripId
   *
   * @param tripId Trip ID
   * @param data Fields to update
   */
  update(
    tripId: string,
    data: Partial<Omit<TripEntity, "tripId" | "createdAt" | "updatedAt">>,
  ): Promise<TripEntity>;

  /**
   * Find all trips that match given query
   */
  findAllTrips?(
    query: AdminGetAllTripsQuery,
  ): Promise<PaginatedPayload<AdminGetAllTripsResponseDTO[]>>;

  /**
   * Finds full trip details formatted for admin dashboard
   *
   * @param tripId Trip ID
   */
  findAdminTripDetails?(
    tripId: string,
  ): Promise<AdminGetTripDetailsResponseDTO | null>;

  atmoicReserveSeat(
    tripId: string,
    seatCount: number,
  ): Promise<TripEntity | null>;
}
