import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ICleanUpBookingPaymentUseCase } from "#/application/interfaces/use-case/booking/ICleanUpBookingPaymentUseCase";
import { BookingPaymentFailureEvent, ILogger } from "@sharemyride/shared";

export class BookingPaymentFailedEventHandler
  implements IEventHandler<BookingPaymentFailureEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _cleanUpBookingPaymentUseCase: ICleanUpBookingPaymentUseCase,
  ) {}

  async handle(event: BookingPaymentFailureEvent): Promise<void> {
    this._logger.info(
      "Handling booking payment failure event: ",
      event.payload.bookingId,
    );

    await this._cleanUpBookingPaymentUseCase.execute({
      bookingId: event.payload.bookingId,
      tripId: "",
      paymentKey: event.payload.paymentKey,
    });
  }
}

export type BookingPayementFailedEventHandler = BookingPaymentFailedEventHandler;
