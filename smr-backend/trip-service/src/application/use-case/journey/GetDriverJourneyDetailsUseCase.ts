import { GetDriverJourneyDetailsResponseDTO } from "#/application/dto/journey/GetDriverJourneyDetailsResponseDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IGetDriverJourneyDetailsUseCase } from "#/application/interfaces/use-case/journey/IGetDriverJourneyDetailsUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  JourneyErrorMessage,
} from "@sharemyride/shared";

export class GetDriverJourneyDetailsUseCase implements IGetDriverJourneyDetailsUseCase {
  constructor(private readonly _journeyRepository: IJourneyRepository) {}

  async execute(
    journeyId: string,
    driverId: string,
  ): Promise<GetDriverJourneyDetailsResponseDTO> {
    const result = await this._journeyRepository.findJourneyById(journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "GetDriverJourneyDetailsUseCase",
          description: `Journey not found with journeyId: ${journeyId}`,
        },
      );
    }

    const { journey, journeyPassengers } = result;

    if (journey.driverId !== driverId) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_TRIP_DRIVER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "GetDriverJourneyDetailsUseCase",
          description: `Journey does not belong to driver: ${driverId}`,
        },
      );
    }

    return {
      journeyId: journey.journeyId,
      journeyStatus: journey.journeyStatus,
      origin: journey.origin,
      destination: journey.destination,
      intermediateStops: journey.intermediateStops.map((stop) => ({
        stopLat: stop.stopLat,
        stopLng: stop.stopLng,
        stopName: stop.stopName,
        stopAddress: stop.stopAddress,
        stopType: stop.stopType,
        passengerId: stop.passengerId,
      })),
      passengers: journeyPassengers.map((p) => ({
        passengerId: p.passengerId,
        passengerName: p.passengerName,
        passengerStatus: p.passengerStatus,
        pickupLocation: p.pickupLocation,
        dropOffLocation: p.dropOffLocation,
      })),
    };
  }
}
