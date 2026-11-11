import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IRemovePassengerFromJourneyUseCase } from "#/application/interfaces/use-cases/journey/IRemovePassengerFromJourneyUseCase";
import { Trace } from "#/presentation/utils/traces-decorator";
import { ILogger, JourneyPassengerDroppedOffEvent } from "@sharemyride/shared";

export class PassengerDroppedOffEventHandler
  implements IEventHandler<JourneyPassengerDroppedOffEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _removePassengerUseCase: IRemovePassengerFromJourneyUseCase,
  ) {}

  @Trace("realtime-service-event-handler")
  async handle(event: JourneyPassengerDroppedOffEvent): Promise<void> {
    try {
      this._logger.info("Handling passenger dropped off event", {
        journeyId: event.payload.journey_id,
        passengerId: event.payload.passenger_id,
      });

      await this._removePassengerUseCase.execute({
        journeyId: event.payload.journey_id,
        passengerId: event.payload.passenger_id,
      });

      this._logger.info("Successfully removed dropped-off passenger from journey room");
    } catch (error: unknown) {
      this._logger.error("Failed to handle passenger dropped off event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
