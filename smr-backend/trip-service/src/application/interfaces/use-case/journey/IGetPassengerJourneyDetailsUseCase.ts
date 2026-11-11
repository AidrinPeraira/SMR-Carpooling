import { GetPassengerJourneyDetailsResponseDTO } from "#/application/dto/journey/GetPassengerJourneyDetailsDTO";

/**
 * This use case aggregates the journey data for the passenger journey detials
 */
export interface IGetPassengerJourneyDetailsUseCase {
  execute(
    journeyId: string,
    passengerId: string,
  ): Promise<GetPassengerJourneyDetailsResponseDTO>;
}
