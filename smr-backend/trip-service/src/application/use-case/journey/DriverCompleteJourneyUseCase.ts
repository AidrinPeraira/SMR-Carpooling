import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IDriverCompleteJourneyUseCase } from "#/application/interfaces/use-case/journey/IDriverCompleteJourneyUseCase";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  JourneyCompletedEventPayload,
  JourneyErrorMessage,
  JourneyStatus,
  PassengerJourneyStatus,
  TripStatus,
} from "@sharemyride/shared";

/**
 * Confirms trip completion for the driver after
 * verifying all passengers have been dropped off
 * or marked as no-show. Updates trip status and
 * publishes completion event to trigger driver
 * payout and clear live tracking.
 */
export class DriverCompleteJourneyUseCase implements IDriverCompleteJourneyUseCase {
  constructor(
    private readonly _journeyRepository: IJourneyRepository,
    private readonly _tripsRepository: ITripRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(journeyId: string, driverId: string): Promise<void> {
    const result = await this._journeyRepository.findJourneyById(journeyId);

    if (!result) {
      throw new ApplicationError(
        JourneyErrorMessage.JOURNEY_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "DriverCompleteJourneyUseCase",
          description: `Journey not found with journeyId: ${journeyId}`,
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
          location: "DriverCompleteJourneyUseCase",
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
          location: "DriverCompleteJourneyUseCase",
          description: `Journey status is '${journey.journeyStatus}', expected '${JourneyStatus.ONGOING}'`,
        },
      );
    }

    const terminalStatuses = [
      PassengerJourneyStatus.DROPPED_OFF,
      PassengerJourneyStatus.NO_SHOW,
    ];

    const pendingPassengers = journeyPassengers.filter(
      (p) => !terminalStatuses.includes(p.passengerStatus),
    );

    if (pendingPassengers.length > 0) {
      throw new ApplicationError(
        JourneyErrorMessage.NOT_ALL_PASSENGERS_DROPPED_OFF,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "DriverCompleteJourneyUseCase",
          description: `${pendingPassengers.length} passenger(s) still have pending status`,
        },
      );
    }

    await this._journeyRepository.updateJourney(journeyId, {
      journeyStatus: JourneyStatus.COMPLETED,
      updatedAt: new Date(),
    });

    await this._tripsRepository.update(journeyId, {
      tripStatus: TripStatus.COMPLETED,
    });

    const completedPassengerIds = journeyPassengers
      .filter((p) => p.passengerStatus === PassengerJourneyStatus.DROPPED_OFF)
      .map((p) => p.passengerId);

    await this._eventBus.publish<JourneyCompletedEventPayload>({
      eventName: EventName.JOURNEY_COMPLETED,
      timestamp: new Date(),
      payload: {
        journey_id: journeyId,
        driver_id: driverId,
        passenger_ids: completedPassengerIds,
      },
    });
  }
}
