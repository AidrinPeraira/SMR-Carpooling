import { DriverTripStatsResponseDTO } from "#/application/dto/driver/DriverTripStatsResponseDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IGetDriverTripStatsUseCase } from "#/application/interfaces/use-case/driver/IGetDriverTripStatsUseCase";

export class GetDriverTripStatsUseCase implements IGetDriverTripStatsUseCase {
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  async execute(driverId: string): Promise<DriverTripStatsResponseDTO> {
    const stats = await this._bookingRepository.getDriverTripStats(driverId);

    return {
      totalTrips: stats.totalTrips,
      tripsThisMonth: stats.tripsThisMonth,
      totalPassengers: stats.totalPassengers,
    };
  }
}
