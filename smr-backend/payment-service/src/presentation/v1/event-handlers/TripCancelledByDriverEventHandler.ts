import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IRefundBookingPaymentUseCase } from "#/application/interfaces/use-cases/payment/IRefundBookingPaymentUseCase";
import { Trace } from "#/presentation/utils/decorators/traces-decorator";
import { DriverCancelTripEvent, ILogger } from "@sharemyride/shared";

export class TripCancelledByDriverEventHandler implements IEventHandler<DriverCancelTripEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _refundBookingPaymentUseCase: IRefundBookingPaymentUseCase,
  ) {}

  @Trace("payment-service-event-handler")
  async handle(event: DriverCancelTripEvent): Promise<void> {
    this._logger.info(
      "Handling trip cancelled by driver event to process refunds for trip: ",
      event.payload.tripId,
    );

    for (const booking of event.payload.cancelledBookings) {
      this._logger.info(`Processing refund for booking: ${booking.bookingId}`);
      // The use case internally checks if a successful payment exists before refunding
      await this._refundBookingPaymentUseCase.execute(booking.bookingId);
    }
  }
}
