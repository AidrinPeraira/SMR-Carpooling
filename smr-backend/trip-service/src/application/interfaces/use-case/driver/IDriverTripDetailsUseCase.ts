import { DriverGetTripDetailsResponseDTO } from "#/application/dto/driver/DriverTripsDTO";

/**
 * This use case gets full trip details. it check if the driver owns the trip
 */
export interface IDriverGetTripDetailsUseCase {
  execute(
    tripId: string,
    driverId: string,
  ): Promise<DriverGetTripDetailsResponseDTO>;
}
