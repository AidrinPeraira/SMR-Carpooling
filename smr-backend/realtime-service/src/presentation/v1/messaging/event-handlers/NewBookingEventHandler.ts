import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, NewBookingEvent } from "@sharemyride/shared";
import { IAddActiveTripUseCase } from "#/application/interfaces/use-cases/members/IAddActiveTripUseCase";
import { Trace } from "#/presentation/utils/traces-decorator";

export class NewBookingEventHandler implements IEventHandler<NewBookingEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _addActiveTripUseCase: IAddActiveTripUseCase,
  ) {}

  @Trace("realtime-service-event-handler")
  async handle(event: NewBookingEvent): Promise<void> {
    try {
      this._logger.info("Handling new booking event in realtime service", {
        bookingId: event.payload.bookingId,
      });

      await this._addActiveTripUseCase.execute({
        userId: event.payload.passengerId,
        tripId: event.payload.tripId,
      });

      this._logger.info(
        "Successfully added active trip from new booking event",
      );
    } catch (error: unknown) {
      this._logger.error("Failed to handle new booking event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
