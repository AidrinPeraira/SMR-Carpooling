import { PassengerNoShowRequestDTO } from "#/application/dto/journey/PassengerNoShowDTO";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { IPassengerNoShowUseCase } from "#/application/interfaces/use-case/journey/IPassengerNoShowUseCase";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  JourneyErrorMessage,
  JourneyPassengerNoShowEventPayload,
  JourneyStatus,
  PassengerJourneyStatus,
  StopType,
} from "@sharemyride/shared";

const MIN_WAIT_MINUTES = 10;

/**
 * Verifies a minimum 10-minute wait after driver
 * arrival at the pickup stop and marks the passenger
 * as no-show. Publishes event to remove live tracking.
 */
export class PassengerNoShowUseCase implements IPassengerNoShowUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(dto: PassengerNoShowRequestDTO): Promise<void> {
    const result = await this._journeyRepository.findJourneyById(dto.journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "PassengerNoShowUseCase",
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
          location: "PassengerNoShowUseCase",
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
          location: "PassengerNoShowUseCase",
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
          location: "PassengerNoShowUseCase",
          description: `Passenger ${dto.passengerId} status is '${passenger.passengerStatus}', cannot mark as no-show`,
        },
      );
    }

    const pickupStop = journey.intermediateStops.find(
      (s) =>
        s.passengerId === dto.passengerId && s.stopType === StopType.PICKUP,
    );

    if (!pickupStop || !pickupStop.arrivedAt) {
      throw new ApplicationError(
        JourneyErrorMessage.DRIVER_NOT_ARRIVED,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "PassengerNoShowUseCase",
          description: `Driver has not arrived at pickup for passenger ${dto.passengerId}`,
        },
      );
    }

    const currentTime = new Date(dto.currentTime);
    const arrivedAt = new Date(pickupStop.arrivedAt);
    const waitedMinutes =
      (currentTime.getTime() - arrivedAt.getTime()) / (1000 * 60);

    if (waitedMinutes < MIN_WAIT_MINUTES) {
      throw new ApplicationError(
        JourneyErrorMessage.NO_SHOW_WAIT_TIME_NOT_MET,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "PassengerNoShowUseCase",
          description: `Driver waited ${Math.round(waitedMinutes)} minutes, minimum is ${MIN_WAIT_MINUTES}`,
        },
      );
    }

    await this._journeyRepository.updateJourneyPassenger(
      dto.journeyId,
      dto.passengerId,
      { passengerStatus: PassengerJourneyStatus.NO_SHOW },
    );

    await this._eventBus.publish<JourneyPassengerNoShowEventPayload>({
      eventName: EventName.JOURNEY_PASSENGER_NO_SHOW,
      timestamp: new Date(),
      payload: {
        journey_id: dto.journeyId,
        driver_id: journey.driverId,
        passenger_id: dto.passengerId,
        booking_id: passenger.bookingId,
      },
    });
  }
}
