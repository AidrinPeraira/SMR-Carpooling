import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendBookingPaymentFailedMailUseCase } from "#/application/interfaces/use-case/ISendBookingPaymentFailedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendBookingPaymentFailedMailUseCase
  implements ISendBookingPaymentFailedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: BookingPaymentMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Booking Payment Failed - ShareMyRide`,
      body: `
      Hello ${data.firstName} ${data.lastName},

      Your payment for booking (ID: ${data.bookingId}) failed or timed out.

      The reserved seats for this booking have been released. If you wish to try again, please initiate a new payment or re-book your ride.
      `,
    };

    await this._mailService.send(notification);
  }
}
