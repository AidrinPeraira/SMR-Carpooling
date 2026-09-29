import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, NewTripEvent } from "@sharemyride/shared";
import { IAddActiveTripUseCase } from "#/application/interfaces/use-cases/members/IAddActiveTripUseCase";
import { Trace } from "#/presentation/utils/traces-decorator";

export class NewTripEventHandler implements IEventHandler<NewTripEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _addActiveTripUseCase: IAddActiveTripUseCase,
  ) {}

  @Trace("realtime-service-event-handler")
  async handle(event: NewTripEvent): Promise<void> {
    try {
      this._logger.info("Handling new trip event in realtime service", {
        tripId: event.payload.tripId,
      });

      await this._addActiveTripUseCase.execute({
        userId: event.payload.driverId,
        tripId: event.payload.tripId,
      });

      this._logger.info(
        "Successfully added active trip for driver from new trip event",
      );
    } catch (error: unknown) {
      this._logger.error("Failed to handle new trip event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
