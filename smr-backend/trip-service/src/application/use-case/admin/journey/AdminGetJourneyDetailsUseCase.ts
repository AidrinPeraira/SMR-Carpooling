import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import {
  AdminGetJourneyDetailsResponseDTO,
  IAdminGetJourneyDetailsUseCase,
} from "#/application/interfaces/use-case/admin/journey/IAdminGetJourneyDetailsUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  JourneyErrorMessage,
} from "@sharemyride/shared";

/**
 * Retrieves the full journey details including all passengers for admin review
 */
export class AdminGetJourneyDetailsUseCase
  implements IAdminGetJourneyDetailsUseCase
{
  constructor(private readonly _journeyRepository: IJourneyRepository) {}

  async execute(journeyId: string): Promise<AdminGetJourneyDetailsResponseDTO> {
    const result = await this._journeyRepository.findJourneyById(journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "AdminGetJourneyDetailsUseCase",
          description: `Journey not found with journeyId: ${journeyId}`,
        },
      );
    }

    const { journey, journeyPassengers } = result;

    return {
      journeyId: journey.journeyId,
      driverId: journey.driverId,
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
        passengerName:
          journeyPassengers.find((p) => p.passengerId === stop.passengerId)
            ?.passengerName ?? "",
        arrivedAt: stop.arrivedAt,
      })),
      passengers: journeyPassengers.map((p) => ({
        passengerId: p.passengerId,
        passengerName: p.passengerName,
        bookingId: p.bookingId,
        passengerStatus: p.passengerStatus,
        pickupLocation: p.pickupLocation,
        dropOffLocation: p.dropOffLocation,
        pickupVerified: p.pickupVerified,
        pickupTime: p.pickupTime,
        dropoffTime: p.dropoffTime,
      })),
      createdAt: journey.createdAt,
      updatedAt: journey.updatedAt,
    };
  }
}
