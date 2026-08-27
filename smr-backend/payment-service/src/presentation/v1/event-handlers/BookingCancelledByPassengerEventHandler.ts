import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IRefundBookingPaymentUseCase } from "#/application/interfaces/use-cases/payment/IRefundBookingPaymentUseCase";
import { ILogger, PassengerCancelBookingEvent } from "@sharemyride/shared";

export class BookingCancelledByPassengerEventHandler
  implements IEventHandler<PassengerCancelBookingEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _refundBookingPaymentUseCase: IRefundBookingPaymentUseCase,
  ) {}

  async handle(event: PassengerCancelBookingEvent): Promise<void> {
    this._logger.info(
      "Handling booking cancelled by passenger event to process refunds: ",
      event.payload.bookingId,
    );

    // The use case internally checks if a successful payment exists before refunding
    await this._refundBookingPaymentUseCase.execute(event.payload.bookingId);
  }
}
