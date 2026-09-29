import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, DriverCancelTripEvent } from "@sharemyride/shared";
import { IRemoveActiveTripUseCase } from "#/application/interfaces/use-cases/members/IRemoveActiveTripUseCase";
import { Trace } from "#/presentation/utils/traces-decorator";

export class DriverCancelTripEventHandler implements IEventHandler<DriverCancelTripEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _removeActiveTripUseCase: IRemoveActiveTripUseCase,
  ) {}

  @Trace("realtime-service-event-handler")
  async handle(event: DriverCancelTripEvent): Promise<void> {
    try {
      this._logger.info(
        "Handling driver cancel trip event in realtime service",
        {
          tripId: event.payload.tripId,
        },
      );

      await this._removeActiveTripUseCase.execute({
        userId: event.payload.driverId,
        tripId: event.payload.tripId,
      });

      if (
        event.payload.cancelledBookings &&
        event.payload.cancelledBookings.length > 0
      ) {
        for (const booking of event.payload.cancelledBookings) {
          await this._removeActiveTripUseCase.execute({
            userId: booking.passengerId,
            tripId: event.payload.tripId,
          });
        }
      }

      this._logger.info(
        "Successfully removed active trips for driver and passengers from cancel trip event",
      );
    } catch (error: unknown) {
      this._logger.error("Failed to handle driver cancel trip event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
