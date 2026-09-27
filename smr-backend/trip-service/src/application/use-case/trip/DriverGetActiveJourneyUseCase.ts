import { DriverGetActiveJourneyResponseDTO } from "#/application/dto/trip/ActiveJourneyDTO";
import { IJourneyPassengerRepository } from "#/application/interfaces/repository/IJourneyPassengerRepository";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IDriverGetActiveJourneyUseCase } from "#/application/interfaces/use-case/trip/IDriverGetActiveJourneyUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  TripErrorMessage,
} from "@sharemyride/shared";

/**
 * This class implements the use case to get the details
 * needed for driver's active trip
 */
export class DriverGetActiveJourneyUseCase
  implements IDriverGetActiveJourneyUseCase
{
  constructor(
    private readonly _journeyRepo: IJourneyRepository,
    private readonly _journeyPassengerRepo: IJourneyPassengerRepository,
  ) {}

  /**
   * @param driverId : ID of the driver (userId)
   */
  async execute(driverId: string): Promise<DriverGetActiveJourneyResponseDTO> {
    //finds current journey for driver
    const journey = await this._journeyRepo.findOngoingByDriverId(driverId);
    if (!journey) {
      throw new ApplicationError(
        TripErrorMessage.NO_ACTIVE_JOURNEY,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverGetActiveJourneyUseCase",
          description: `No ongoing journey found for driverId: ${driverId}`,
        },
      );
    }

    //aggreagates the needed data ans returns response dto
    const passengers = await this._journeyPassengerRepo.findByJourneyId(
      journey.journeyId,
    );

    return {
      journeyId: journey.journeyId,
      origin: journey.origin,
      destination: journey.destination,
      intermediateStops: journey.intermediateStops,
      journeyStatus: journey.journeyStatus,
      startedAt: journey.createdAt,
      //the pickup OTP is left out, the passenger shows it and the driver
      //submits it to verify
      passengers: passengers.map((passenger) => ({
        journeyPassengerId: passenger.journeyPassengerId,
        passengerId: passenger.passengerId,
        passengerName: passenger.passengerName,
        bookingId: passenger.bookingId,
        passengerStatus: passenger.passengerStatus,
        pickupLocation: passenger.pickupLocation,
        dropOffLocation: passenger.dropOffLocation,
        pickupTime: passenger.pickupTime,
        dropoffTime: passenger.dropoffTime,
        pickupVerified: passenger.pickupVerified,
      })),
    };
  }
}
