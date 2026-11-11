import { AdminGetTripDetailsResponseDTO } from "#/application/dto/admin/AdminTripsDTO";

/**
 * This use case list trip data and booking list for
 * a trip.
 */
export interface IAdminGetTripDetailsUseCase {
  execute(tripId: string): Promise<AdminGetTripDetailsResponseDTO>;
}

