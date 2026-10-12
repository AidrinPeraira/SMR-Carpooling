import { GetDriverJourneyDetailsResponseDTO } from "#/application/dto/journey/GetDriverJourneyDetailsResponseDTO";

/**
 * This use case aggreagets the details
 * of a journey and its passenger for the driver
 */
export interface IGetDriverJourneyDetailsUseCase {
  execute(
    journeyId: string,
    driverId: string,
  ): Promise<GetDriverJourneyDetailsResponseDTO>;
}
