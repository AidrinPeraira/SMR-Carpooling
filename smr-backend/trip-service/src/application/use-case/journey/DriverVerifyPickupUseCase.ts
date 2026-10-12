import { DriverVerifyPickupRequestDTO } from "#/application/dto/journey/DriverVerifyPickupDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IDriverVerifyPickupUseCase } from "#/application/interfaces/use-case/journey/IDriverVerifyPickupUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  JourneyErrorMessage,
  JourneyStatus,
  PassengerJourneyStatus,
} from "@sharemyride/shared";

/**
 * Verifies the OTP from the passenger,
 * passed on by the driver, to confirm
 * that pickup identity is valid.
 */
export class DriverVerifyPickupUseCase implements IDriverVerifyPickupUseCase {
  constructor(private readonly _journeyRepository: IJourneyRepository) {}

  async execute(
    dto: DriverVerifyPickupRequestDTO,
    driverId: string,
  ): Promise<void> {
    const result = await this._journeyRepository.findJourneyById(dto.journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Journey not found with journeyId: ${dto.journeyId}`,
        },
      );
    }

    const { journey, journeyPassengers } = result;

    if (journey.driverId !== driverId) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_DRIVER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Journey does not belong to driver: ${driverId}`,
        },
      );
    }

    if (journey.journeyStatus !== JourneyStatus.ONGOING) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_ACTIVE,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${JourneyStatus.ONGOING}'`,
        },
      );
    }

    const passenger = journeyPassengers.find(
      (p) => p.passengerId === dto.passengerId,
    );

    if (!passenger) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_PASSENGER,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Passenger ${dto.passengerId} is not part of journey: ${dto.journeyId}`,
        },
      );
    }

    if (passenger.passengerStatus !== PassengerJourneyStatus.NOT_BOARDED) {
      throw new ApplicationError(
        JourneyErrorMessage.PASSENGER_ALREADY_PICKED_UP,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Passenger ${dto.passengerId} status is '${passenger.passengerStatus}'`,
        },
      );
    }

    if (passenger.pickupOTP !== dto.pickupOtp) {
      throw new ApplicationError(
        JourneyErrorMessage.INVALID_PICKUP_OTP,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        ErrorDetails.INPUT_VALIDATION_ERROR,
        {
          location: "DriverVerifyPickupUseCase",
          description: `Invalid OTP for passenger ${dto.passengerId}`,
        },
      );
    }

    await this._journeyRepository.updateJourneyPassenger(
      dto.journeyId,
      dto.passengerId,
      { pickupVerified: true },
    );
  }
}
