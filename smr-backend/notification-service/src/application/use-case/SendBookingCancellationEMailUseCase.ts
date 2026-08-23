import { BookingCancellationMailDTO } from "#/application/dto/email/BookingCancellationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendBookingCancellationEmailUseCase } from "#/application/interfaces/use-case/ISendBookingCancellationEmail";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendBookingCancellationEmailUseCase implements ISendBookingCancellationEmailUseCase {
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: BookingCancellationMailDTO): Promise<void> {
    const driverNotification: NotificationEntity = {
      recipient: data.driverEmail,
      subject: `Booking Cancelled - ShareMyRide`,
      body: `
      Hello ${data.driverName},

      A passenger has cancelled their booking for your trip.

      Passenger: ${data.passengerName}
      Pickup: ${data.bookingStart}
      Drop-off: ${data.bookingStop}

      The seats they reserved are now available again for other passengers.
      `,
    };

    const passengerNotification: NotificationEntity = {
      recipient: data.passengerEmail,
      subject: `Booking Cancelled Successfully - ShareMyRide`,
      body: `
      Hello ${data.passengerName},

      Your booking (ID: ${data.bookingId}) has been successfully cancelled.

      Driver: ${data.driverName}
      Pickup: ${data.bookingStart}
      Drop-off: ${data.bookingStop}
      Amount: ₹${data.amount}

      If you have already paid for this booking, the refund will be processed shortly.
      `,
    };

    await Promise.all([
      this._mailService.send(driverNotification),
      this._mailService.send(passengerNotification),
    ]);
  }
}
