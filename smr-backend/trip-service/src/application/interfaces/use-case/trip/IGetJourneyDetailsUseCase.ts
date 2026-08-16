import { GetJourneyDetailsResponseDTO } from "#/application/dto/trip/PassengerListTripsDTO";

/**
 * This use case returns additional details needed for route
 * and fare calculation before booking
 */
export interface IGetJourneyDetailsUseCase {
  execute(tripId: string): Promise<GetJourneyDetailsResponseDTO>;
}
