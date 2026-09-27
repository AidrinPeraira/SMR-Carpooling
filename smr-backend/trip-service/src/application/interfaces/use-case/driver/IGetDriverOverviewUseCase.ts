import { DriverOverviewResponseDTO } from "#/application/dto/driver/DriverOverviewDTO";

/**
 * This use case aggregates the data for a summary of recent trips, bookings
 * earnings etc for the driver dashboard
 */
export interface IGetDriverOverviewUseCase {
  execute(driverId: string): Promise<DriverOverviewResponseDTO>;
}
