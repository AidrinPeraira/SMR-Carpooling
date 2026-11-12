import { NewBookingMailDTO } from "#/application/dto/email/NewBookingMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendNewBookingEmailUseCase } from "#/application/interfaces/use-case/ISendNewBookingEmailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendNewBookingEmailUseCase
  implements ISendNewBookingEmailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: NewBookingMailDTO): Promise<void> {
    const driverNotification: NotificationEntity = {
      recipient: data.driverEmail,
      subject: `New Booking Request - ShareMyRide`,
      body: EmailTemplate.generate(
        "New Booking Request",
        `
        <p>Hello <strong>${data.driverName}</strong>,</p>
        <p>You have received a new booking request on your trip!</p>
        <table class="data-table">
          <tr><th>Passenger:</th><td>${data.passengerName}</td></tr>
          <tr><th>Seats Requested:</th><td>${data.seatCount}</td></tr>
          <tr><th>Total Amount:</th><td>₹${data.bookingAmount}</td></tr>
          <tr><th>Pickup:</th><td>${data.passengerOrigin.stopName} (${data.passengerOrigin.stopAddress})</td></tr>
          <tr><th>Drop-off:</th><td>${data.passengerDestination.stopName} (${data.passengerDestination.stopAddress})</td></tr>
          <tr><th>Trip Date:</th><td>${new Date(data.tripDate).toLocaleString()}</td></tr>
        </table>
        <p>Please review the booking request in your ShareMyRide dashboard.</p>
        <a href="https://sharemyride.com/dashboard" class="button">View Dashboard</a>
        `
      ),
    };

    const passengerNotification: NotificationEntity = {
      recipient: data.passengerEmail,
      subject: `Booking Request Submitted - ShareMyRide`,
      body: EmailTemplate.generate(
        "Booking Request Submitted",
        `
        <p>Hello <strong>${data.passengerName}</strong>,</p>
        <p>Your booking request (ID: <strong>${data.bookingId}</strong>) has been successfully submitted!</p>
        <table class="data-table">
          <tr><th>Driver:</th><td>${data.driverName}</td></tr>
          <tr><th>Seats:</th><td>${data.seatCount}</td></tr>
          <tr><th>Total Price:</th><td>₹${data.bookingAmount}</td></tr>
          <tr><th>Pickup:</th><td>${data.passengerOrigin.stopName}</td></tr>
          <tr><th>Drop-off:</th><td>${data.passengerDestination.stopName}</td></tr>
        </table>
        <p>We will notify you once the driver confirms your booking.</p>
        `
      ),
    };

    await Promise.all([
      this._mailService.send(driverNotification),
      this._mailService.send(passengerNotification),
    ]);
  }
}
