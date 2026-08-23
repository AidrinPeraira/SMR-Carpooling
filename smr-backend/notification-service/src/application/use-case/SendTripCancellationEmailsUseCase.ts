import { TripCancellationMailDTO } from "#/application/dto/email/TripCancellationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendTripCancellationEmailUseCase } from "#/application/interfaces/use-case/ISendTripCancellationEmail";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendTripCancellationEmailsUseCase implements ISendTripCancellationEmailUseCase {
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: TripCancellationMailDTO): Promise<void> {
    const driverNotification: NotificationEntity = {
      recipient: data.driverEmail,
      subject: `Trip Cancelled Successfully - ShareMyRide`,
      body: `
      Hello ${data.driverName},

      Your trip (ID: ${data.tripId}) has been successfully cancelled.
      All associated bookings have been cancelled and passengers have been notified.
      `,
    };

    const passengerNotifications: NotificationEntity[] =
      data.cancelledBookings.map((booking) => ({
        recipient: booking.passengerEmail,
        subject: `Trip Cancelled by Driver - ShareMyRide`,
        body: `
      Hello ${booking.passengerName},

      We regret to inform you that your upcoming trip with ${data.driverName} has been cancelled by the driver.
      Your booking (ID: ${booking.bookingId}) has been cancelled.
      
      Any payments made will be refunded to your original payment method shortly.
      `,
      }));

    await Promise.all([
      this._mailService.send(driverNotification),
      ...passengerNotifications.map((notification) =>
        this._mailService.send(notification),
      ),
    ]);
  }
}
