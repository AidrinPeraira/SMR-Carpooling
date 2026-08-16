import { DriverGetTripDetailsResponseDTO } from "#/application/dto/trip/DriverTripsDetailsDTO";

/**
 * This use case gets full trip details. it check if the driver owns the trip
 */
export interface IDriverGetTripDetailsUseCase {
  execute(
    tripId: string,
    driverId: string,
  ): Promise<DriverGetTripDetailsResponseDTO>;
}
