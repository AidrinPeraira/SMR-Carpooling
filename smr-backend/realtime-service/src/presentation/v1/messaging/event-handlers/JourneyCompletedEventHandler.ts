import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IEndJourneyUseCase } from "#/application/interfaces/use-cases/journey/IEndJourneyUseCase";
import { Trace } from "#/presentation/utils/traces-decorator";
import { ILogger, JourneyCompletedEvent } from "@sharemyride/shared";

export class JourneyCompletedEventHandler
  implements IEventHandler<JourneyCompletedEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _endJourneyUseCase: IEndJourneyUseCase,
  ) {}

  @Trace("realtime-service-event-handler")
  async handle(event: JourneyCompletedEvent): Promise<void> {
    try {
      this._logger.info("Handling journey completed event", {
        journeyId: event.payload.journey_id,
      });

      await this._endJourneyUseCase.execute({
        journeyId: event.payload.journey_id,
      });

      this._logger.info("Successfully ended journey room");
    } catch (error: unknown) {
      this._logger.error("Failed to handle journey completed event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
