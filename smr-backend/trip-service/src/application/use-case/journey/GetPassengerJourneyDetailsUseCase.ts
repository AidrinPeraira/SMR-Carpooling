import { GetPassengerJourneyDetailsResponseDTO } from "#/application/dto/journey/GetPassengerJourneyDetailsDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IGetPassengerJourneyDetailsUseCase } from "#/application/interfaces/use-case/journey/IGetPassengerJourneyDetailsUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  JourneyErrorMessage,
} from "@sharemyride/shared";

export class GetPassengerJourneyDetailsUseCase implements IGetPassengerJourneyDetailsUseCase {
  constructor(private readonly _journeyRepository: IJourneyRepository) {}

  async execute(
    journeyId: string,
    passengerId: string,
  ): Promise<GetPassengerJourneyDetailsResponseDTO> {
    const result = await this._journeyRepository.findJourneyById(journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "GetPassengerJourneyDetailsUseCase",
          description: `Journey not found with journeyId: ${journeyId}`,
        },
      );
    }

    const { journey, journeyPassengers } = result;

    const myRecord = journeyPassengers.find(
      (p) => p.passengerId === passengerId,
    );

    if (!myRecord) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_PASSENGER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "GetPassengerJourneyDetailsUseCase",
          description: `Passenger ${passengerId} is not part of journey: ${journeyId}`,
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
        passengerName: journeyPassengers.find((p) => p.passengerId === stop.passengerId)?.passengerName ?? "",
        arrivedAt: stop.arrivedAt,
      })),
      myDetails: {
        passengerStatus: myRecord.passengerStatus,
        pickupLocation: myRecord.pickupLocation,
        dropOffLocation: myRecord.dropOffLocation,
        pickupOTP: myRecord.pickupOTP,
      },
      otherPassengers: journeyPassengers
        .filter((p) => p.passengerId !== passengerId)
        .map((p) => ({
          passengerName: p.passengerName,
          pickupLocation: p.pickupLocation,
          dropOffLocation: p.dropOffLocation,
        })),
    };
  }
}
