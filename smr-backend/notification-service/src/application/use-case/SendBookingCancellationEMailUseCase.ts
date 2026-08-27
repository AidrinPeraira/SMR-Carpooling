import { BookingCancellationMailDTO } from "#/application/dto/email/BookingCancellationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendBookingCancellationEmailUseCase } from "#/application/interfaces/use-case/ISendBookingCancellationEmail";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendBookingCancellationEmailUseCase implements ISendBookingCancellationEmailUseCase {
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: BookingCancellationMailDTO): Promise<void> {
    const driverNotification: NotificationEntity = {
      recipient: data.driverEmail,
      subject: `Booking Cancelled - ShareMyRide`,
      body: EmailTemplate.generate(
        "Booking Cancelled",
        `
        <p>Hello <strong>${data.driverName}</strong>,</p>
        <p>A passenger has cancelled their booking for your trip.</p>
        <table class="data-table">
          <tr><th>Passenger:</th><td>${data.passengerName}</td></tr>
          <tr><th>Pickup:</th><td>${data.bookingStart}</td></tr>
          <tr><th>Drop-off:</th><td>${data.bookingStop}</td></tr>
        </table>
        <p>The seats they reserved are now available again for other passengers.</p>
        `
      ),
    };

    const passengerNotification: NotificationEntity = {
      recipient: data.passengerEmail,
      subject: `Booking Cancelled Successfully - ShareMyRide`,
      body: EmailTemplate.generate(
        "Booking Cancelled",
        `
        <p>Hello <strong>${data.passengerName}</strong>,</p>
        <p>Your booking (ID: <strong>${data.bookingId}</strong>) has been successfully cancelled.</p>
        <table class="data-table">
          <tr><th>Driver:</th><td>${data.driverName}</td></tr>
          <tr><th>Pickup:</th><td>${data.bookingStart}</td></tr>
          <tr><th>Drop-off:</th><td>${data.bookingStop}</td></tr>
          <tr><th>Amount:</th><td>₹${data.amount}</td></tr>
        </table>
        <p>If you have already paid for this booking, the refund will be processed shortly.</p>
        `
      ),
    };

    await Promise.all([
      this._mailService.send(driverNotification),
      this._mailService.send(passengerNotification),
    ]);
  }
}
