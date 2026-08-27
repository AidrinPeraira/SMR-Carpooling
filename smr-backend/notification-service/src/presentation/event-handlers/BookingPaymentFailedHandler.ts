import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendBookingPaymentFailedMailUseCase } from "#/application/interfaces/use-case/ISendBookingPaymentFailedMailUseCase";
import { BookingPaymentFailureEvent, ILogger } from "@sharemyride/shared";

export class BookingPaymentFailedHandler
  implements IEventHandler<BookingPaymentFailureEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendBookingPaymentFailedMailUseCase: ISendBookingPaymentFailedMailUseCase,
  ) {}

  async handle(event: BookingPaymentFailureEvent): Promise<void> {
    const dto: BookingPaymentMailDTO = {
      passengerId: event.payload.passengerId,
      firstName: event.payload.firstName,
      lastName: event.payload.lastName,
      emailId: event.payload.emailId,
      bookingId: event.payload.bookingId,
    };

    this._logger.info(
      "Handling booking payment failed notification for booking:",
      {
        bookingId: dto.bookingId,
        emailId: dto.emailId,
      },
    );

    await this._sendBookingPaymentFailedMailUseCase.execute(dto);
  }
}
