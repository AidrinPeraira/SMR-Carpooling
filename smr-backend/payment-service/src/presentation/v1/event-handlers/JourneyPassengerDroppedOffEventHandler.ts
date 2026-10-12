import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ICreatePayoutUseCase } from "#/application/interfaces/use-cases/payout/ICreatePayoutUseCase";
import { Trace } from "#/presentation/utils/decorators/traces-decorator";
import { ILogger, JourneyPassengerDroppedOffEvent } from "@sharemyride/shared";

export class JourneyPassengerDroppedOffEventHandler implements IEventHandler<JourneyPassengerDroppedOffEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _createPayoutUseCase: ICreatePayoutUseCase,
  ) {}

  @Trace("payment-service-event-handler")
  async handle(event: JourneyPassengerDroppedOffEvent): Promise<void> {
    this._logger.info(
      "Handling passenger dropped off event to create payout for booking: ",
      event.payload.booking_id,
    );

    await this._createPayoutUseCase.execute({
      journeyId: event.payload.journey_id,
      driverId: event.payload.driver_id,
      passengerId: event.payload.passenger_id,
      bookingId: event.payload.booking_id,
      amount: event.payload.amount,
    });
  }
}
