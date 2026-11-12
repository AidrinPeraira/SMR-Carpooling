import { TripCancellationMailDTO } from "#/application/dto/email/TripCancellationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendTripCancellationEmailUseCase } from "#/application/interfaces/use-case/ISendTripCancellationEmail";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendTripCancellationEmailsUseCase implements ISendTripCancellationEmailUseCase {
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: TripCancellationMailDTO): Promise<void> {
    const driverNotification: NotificationEntity = {
      recipient: data.driverEmail,
      subject: `Trip Cancelled Successfully - ShareMyRide`,
      body: EmailTemplate.generate(
        "Trip Cancelled",
        `
        <p>Hello <strong>${data.driverName}</strong>,</p>
        <p>Your trip (ID: <strong>${data.tripId}</strong>) has been successfully cancelled.</p>
        <p>All associated bookings have been cancelled and passengers have been notified.</p>
        `
      ),
    };

    const passengerNotifications: NotificationEntity[] =
      data.cancelledBookings.map((booking) => ({
        recipient: booking.passengerEmail,
        subject: `Trip Cancelled by Driver - ShareMyRide`,
        body: EmailTemplate.generate(
          "Trip Cancelled",
          `
          <p>Hello <strong>${booking.passengerName}</strong>,</p>
          <p>We regret to inform you that your upcoming trip with <strong>${data.driverName}</strong> has been cancelled by the driver.</p>
          <p>Your booking (ID: <strong>${booking.bookingId}</strong>) has been cancelled.</p>
          <p>Any payments made will be refunded to your original payment method shortly.</p>
          `
        ),
      }));

    await Promise.all([
      this._mailService.send(driverNotification),
      ...passengerNotifications.map((notification) =>
        this._mailService.send(notification),
      ),
    ]);
  }
}
