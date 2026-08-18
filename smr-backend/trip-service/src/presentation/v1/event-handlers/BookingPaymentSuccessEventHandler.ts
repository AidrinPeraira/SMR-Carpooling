import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IConfirmBookingPaymentUseCase } from "#/application/interfaces/use-case/booking/IConfirmBookingPayementUseCase";
import { BookingPaymentSuccessEvent, ILogger } from "@sharemyride/shared";

/*
 * This event handler calls the use case to confirm booking
 */
export class BookingPaymentSuccessEventHandler
  implements IEventHandler<BookingPaymentSuccessEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _confirmBookingPaymentUseCase: IConfirmBookingPaymentUseCase,
  ) {}

  async handle(event: BookingPaymentSuccessEvent): Promise<void> {
    this._logger.info(
      "Handling booking payment success event: ",
      event.payload.bookingId,
    );

    await this._confirmBookingPaymentUseCase.execute(event.payload.bookingId);
  }
}
