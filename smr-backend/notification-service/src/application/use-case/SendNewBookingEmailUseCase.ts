import { NewBookingMailDTO } from "#/application/dto/email/NewBookingMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendNewBookingEmailUseCase } from "#/application/interfaces/use-case/ISendNewBookingEmailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendNewBookingEmailUseCase
  implements ISendNewBookingEmailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: NewBookingMailDTO): Promise<void> {
    const driverNotification: NotificationEntity = {
      recipient: data.driverEmail,
      subject: `New Booking Request - ShareMyRide`,
      body: `
      Hello ${data.driverName},

      You have received a new booking request on your trip!

      Passenger: ${data.passengerName}
      Seats Requested: ${data.seatCount}
      Total Amount: ₹${data.bookingAmount}
      Pickup: ${data.passengerOrigin.stopName} (${data.passengerOrigin.stopAddress})
      Drop-off: ${data.passengerDestination.stopName} (${data.passengerDestination.stopAddress})
      Trip Date: ${new Date(data.tripDate).toLocaleString()}

      Please review the booking request in your ShareMyRide dashboard.
      `,
    };

    const passengerNotification: NotificationEntity = {
      recipient: data.passengerEmail,
      subject: `Booking Request Submitted - ShareMyRide`,
      body: `
      Hello ${data.passengerName},

      Your booking request (ID: ${data.bookingId}) has been successfully submitted!

      Driver: ${data.driverName}
      Seats: ${data.seatCount}
      Total Price: ₹${data.bookingAmount}
      Pickup: ${data.passengerOrigin.stopName}
      Drop-off: ${data.passengerDestination.stopName}

      We will notify you once the driver confirms your booking.
      `,
    };

    await Promise.all([
      this._mailService.send(driverNotification),
      this._mailService.send(passengerNotification),
    ]);
  }
}
