import { NewBookingMailDTO } from "#/application/dto/email/NewBookingMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendNewBookingEmailUseCase } from "#/application/interfaces/use-case/ISendNewBookingEmailUseCase";
import { ILogger, NewBookingEvent } from "@sharemyride/shared";

export class NewBookingHandler implements IEventHandler<NewBookingEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendNewBookingEmailUseCase: ISendNewBookingEmailUseCase,
  ) {}

  async handle(event: NewBookingEvent): Promise<void> {
    const dto: NewBookingMailDTO = {
      bookingId: event.payload.bookingId,
      passengerName: event.payload.passengerName,
      passengerEmail: event.payload.passengerEmail,
      passengerOrigin: event.payload.passengerOrigin,
      passengerDestination: event.payload.passengerDestination,
      seatCount: event.payload.seatCount,
      bookingAmount: event.payload.bookingAmount,
      driverName: event.payload.driverName,
      driverEmail: event.payload.driverEmail,
      tripId: event.payload.tripId,
      tripDate: event.payload.tripDate,
    };

    this._logger.info("Handling new booking event for booking:", {
      bookingId: dto.bookingId,
      passengerEmail: dto.passengerEmail,
      driverEmail: dto.driverEmail,
    });

    await this._sendNewBookingEmailUseCase.execute(dto);
  }
}
