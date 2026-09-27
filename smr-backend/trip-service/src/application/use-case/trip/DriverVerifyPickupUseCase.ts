import { DriverVerifyPickupRequestDTO } from "#/application/dto/trip/ActiveJourneyDTO";
import { IJourneyPassengerRepository } from "#/application/interfaces/repository/IJourneyPassengerRepository";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IDriverVerifyPickupUseCase } from "#/application/interfaces/use-case/trip/IDriverVerifyPickupUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PassengerRideStatus,
  TripErrorMessage,
  TripStatus,
} from "@sharemyride/shared";

/**
 * This class implements the use case that verifies a passenger
 * pickup using the OTP the passenger shows to the driver
 */
export class DriverVerifyPickupUseCase implements IDriverVerifyPickupUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _journeyPassengerRepo: IJourneyPassengerRepository,
  ) {}

  async execute(dto: DriverVerifyPickupRequestDTO): Promise<void> {
    //finds the journey mathcing journey id.
    const journey = await this._journeyRepository.findById(dto.journeyId);
    if (!journey) {
      throw new ApplicationError(
        TripErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Journey not found with journeyId: ${dto.journeyId}`,
        },
      );
    }

    //verify the driver id
    if (journey.driverId !== dto.driverId) {
      throw new ApplicationError(
        TripErrorMessage.UNAUTHORIZED_JOURNEY,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Journey does not belong to driver: ${dto.driverId}`,
        },
      );
    }

    //verify the journey is still ongoing
    if (journey.journeyStatus !== TripStatus.ONGOING) {
      throw new ApplicationError(
        TripErrorMessage.JOURNEY_NOT_ONGOING,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${TripStatus.ONGOING}'`,
        },
      );
    }

    //verify the passenger belongs to the journey
    const journeyPassengers = await this._journeyPassengerRepo.findByJourneyId(
      journey.journeyId,
    );
    const journeyPassenger = journeyPassengers.find(
      (passenger) => passenger.passengerId === dto.passengerId,
    );
    if (!journeyPassenger) {
      throw new ApplicationError(
        TripErrorMessage.PASSENGER_NOT_IN_JOURNEY,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Passenger ${dto.passengerId} is not part of journey: ${journey.journeyId}`,
        },
      );
    }

    //only a passenger still waiting can be picked up
    if (journeyPassenger.passengerStatus !== PassengerRideStatus.WAITING) {
      throw new ApplicationError(
        TripErrorMessage.PASSENGER_NOT_WAITING,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Passenger status is '${journeyPassenger.passengerStatus}', expected '${PassengerRideStatus.WAITING}'`,
        },
      );
    }

    //the OTP the passenger shows is the proof of the pickup
    if (
      !journeyPassenger.pickupOTP ||
      journeyPassenger.pickupOTP !== dto.pickupOTP
    ) {
      throw new ApplicationError(
        TripErrorMessage.INVALID_PICKUP_OTP,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Pickup OTP did not match for passenger: ${dto.passengerId}`,
        },
      );
    }

    await this._journeyPassengerRepo.updateById(
      journeyPassenger.journeyPassengerId,
      {
        passengerStatus: PassengerRideStatus.PICKED_UP,
        pickupTime: new Date(),
        pickupVerified: true,
      },
    );
  }
}
