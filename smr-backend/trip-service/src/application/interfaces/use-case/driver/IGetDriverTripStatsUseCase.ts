import { DriverTripStatsResponseDTO } from "#/application/dto/driver/DriverTripStatsResponseDTO";

/**
 * This use case aggregates and returns stats data for a driver
 */
export interface IGetDriverTripStatsUseCase {
  execute(driverId: string): Promise<DriverTripStatsResponseDTO>;
}
