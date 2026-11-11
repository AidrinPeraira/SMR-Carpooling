import { PassengerConfirmPickupRequestDTO } from "#/application/dto/journey/PassengerConfirmPickupDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IPassengerConfirmPickupUseCase } from "#/application/interfaces/use-case/journey/IPassengerConfirmPickupUseCase";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  JourneyErrorMessage,
  JourneyPassengerPickedUpEventPayload,
  JourneyStatus,
  PassengerJourneyStatus,
} from "@sharemyride/shared";

/**
 * Confirms that the passenger has been picked up
 * after OTP verification, updating the pickup time
 * and passenger status.
 */
export class PassengerConfirmPickupUseCase implements IPassengerConfirmPickupUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(
    dto: PassengerConfirmPickupRequestDTO,
    passengerId: string,
  ): Promise<void> {
    const result = await this._journeyRepository.findJourneyById(dto.journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "PassengerConfirmPickupUseCase",
          description: `Journey not found with journeyId: ${dto.journeyId}`,
        },
      );
    }

    const { journey, journeyPassengers } = result;

    if (journey.journeyStatus !== JourneyStatus.ONGOING) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_ACTIVE,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "PassengerConfirmPickupUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${JourneyStatus.ONGOING}'`,
        },
      );
    }

    const passenger = journeyPassengers.find(
      (p) => p.passengerId === passengerId,
    );

    if (!passenger) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_JOURNEY_PASSENGER,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "PassengerConfirmPickupUseCase",
          description: `Passenger ${passengerId} is not part of journey: ${dto.journeyId}`,
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
          location: "PassengerConfirmPickupUseCase",
          description: `Passenger ${passengerId} status is '${passenger.passengerStatus}'`,
        },
      );
    }

    if (!passenger.pickupVerified) {
      throw new ApplicationError(
        JourneyErrorMessage.PICKUP_OTP_NOT_VALIDATED,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "PassengerConfirmPickupUseCase",
          description: `Pickup OTP has not been verified for passenger ${passengerId}`,
        },
      );
    }

    await this._journeyRepository.updateJourneyPassenger(
      dto.journeyId,
      passengerId,
      {
        passengerStatus: PassengerJourneyStatus.PICKED_UP,
        pickupTime: new Date(dto.pickupTime),
      },
    );

    await this._eventBus.publish<JourneyPassengerPickedUpEventPayload>({
      eventName: EventName.JOURNEY_PASSENGER_PICKED_UP,
      timestamp: new Date(),
      payload: {
        journey_id: dto.journeyId,
        driver_id: journey.driverId,
        passenger_id: passengerId,
      },
    });
  }
}
