import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ICreateJourneyUseCase } from "#/application/interfaces/use-cases/journey/ICreateJourneyUseCase";
import { Trace } from "#/presentation/utils/traces-decorator";
import { ILogger, JourneyStartedEvent } from "@sharemyride/shared";

export class JourneyStartedEventHandler
  implements IEventHandler<JourneyStartedEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _createJourneyUseCase: ICreateJourneyUseCase,
  ) {}

  @Trace("realtime-service-event-handler")
  async handle(event: JourneyStartedEvent): Promise<void> {
    try {
      this._logger.info("Handling journey started event", {
        journeyId: event.payload.journey_id,
      });

      await this._createJourneyUseCase.execute({
        journeyId: event.payload.journey_id,
        driverId: event.payload.driver_id,
        membersIDs: event.payload.passenger_ids,
      });

      this._logger.info("Successfully created journey from journey started event");
    } catch (error: unknown) {
      this._logger.error("Failed to handle journey started event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
