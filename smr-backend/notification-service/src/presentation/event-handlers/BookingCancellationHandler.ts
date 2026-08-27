import { BookingCancellationMailDTO } from "#/application/dto/email/BookingCancellationMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendBookingCancellationEmailUseCase } from "#/application/interfaces/use-case/ISendBookingCancellationEmail";
import { ILogger, PassengerCancelBookingEvent } from "@sharemyride/shared";

export class BookingCancellationHandler implements IEventHandler<PassengerCancelBookingEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendBookingCancellationEmailUseCase: ISendBookingCancellationEmailUseCase,
  ) {}

  async handle(event: PassengerCancelBookingEvent): Promise<void> {
    const dto: BookingCancellationMailDTO = {
      bookingId: event.payload.bookingId,
      passengerName: event.payload.passengerName,
      passengerEmail: event.payload.passengerEmail,
      driverName: event.payload.driverName,
      driverEmail: event.payload.driverEmail,
      bookingStart: event.payload.bookingStart,
      bookingStop: event.payload.bookingStop,
      amount: event.payload.amount,
    };

    this._logger.info("Handling booking cancellation event for booking:", {
      bookingId: dto.bookingId,
      passengerEmail: dto.passengerEmail,
      driverEmail: dto.driverEmail,
    });

    await this._sendBookingCancellationEmailUseCase.execute(dto);
  }
}
