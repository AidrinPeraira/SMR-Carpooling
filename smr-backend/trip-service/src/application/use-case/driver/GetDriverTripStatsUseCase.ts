import { DriverTripStatsResponseDTO } from "#/application/dto/driver/DriverTripStatsResponseDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IGetDriverTripStatsUseCase } from "#/application/interfaces/use-case/driver/IGetDriverTripStatsUseCase";

export class GetDriverTripStatsUseCase implements IGetDriverTripStatsUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  async execute(driverId: string): Promise<DriverTripStatsResponseDTO> {
    const stats = await this._tripRepository.getDriverTripStats(driverId);

    return {
      totalTrips: stats.totalTrips,
      tripsThisMonth: stats.tripsThisMonth,
      totalPassengers: stats.totalPassengers,
    };
  }
}
