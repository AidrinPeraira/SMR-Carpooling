import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, PassengerCancelBookingEvent } from "@sharemyride/shared";
import { IRemoveActiveTripUseCase } from "#/application/interfaces/use-cases/members/IRemoveActiveTripUseCase";
import { Trace } from "#/presentation/utils/traces-decorator";

export class PassengerCancelBookingEventHandler implements IEventHandler<PassengerCancelBookingEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _removeActiveTripUseCase: IRemoveActiveTripUseCase,
  ) {}

  @Trace("realtime-service-event-handler")
  async handle(event: PassengerCancelBookingEvent): Promise<void> {
    try {
      this._logger.info(
        "Handling passenger cancel booking event in realtime service",
        {
          bookingId: event.payload.bookingId,
          tripId: event.payload.tripId,
        },
      );

      await this._removeActiveTripUseCase.execute({
        userId: event.payload.passengerId,
        tripId: event.payload.tripId,
      });

      this._logger.info(
        "Successfully removed active trip from passenger cancel booking event",
      );
    } catch (error: unknown) {
      this._logger.error("Failed to handle passenger cancel booking event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
