import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendBookingPaymentSuccessMailUseCase } from "#/application/interfaces/use-case/ISendBookingPaymentSuccessMailUseCase";
import { BookingPaymentSuccessEvent, ILogger } from "@sharemyride/shared";

export class BookingPaymentSuccessHandler
  implements IEventHandler<BookingPaymentSuccessEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendBookingPaymentSuccessMailUseCase: ISendBookingPaymentSuccessMailUseCase,
  ) {}

  async handle(event: BookingPaymentSuccessEvent): Promise<void> {
    const dto: BookingPaymentMailDTO = {
      passengerId: event.payload.passengerId,
      firstName: event.payload.firstName,
      lastName: event.payload.lastName,
      emailId: event.payload.emailId,
      bookingId: event.payload.bookingId,
    };

    this._logger.info(
      "Handling booking payment success notification for booking:",
      {
        bookingId: dto.bookingId,
        emailId: dto.emailId,
      },
    );

    await this._sendBookingPaymentSuccessMailUseCase.execute(dto);
  }
}
