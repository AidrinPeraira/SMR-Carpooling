import { DriverTodayTripResponseDTO } from "#/application/dto/trip/DriverTripDTO";

/**
 * This use case handles fetching the trip for the current day for
 * driver. Returns null if trip doesn't exist
 */
export interface IGetDriverTodayTripUseCase {
  execute(driverId: string): Promise<DriverTodayTripResponseDTO | null>;
}
