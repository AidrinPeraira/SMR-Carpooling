import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendBookingPaymentSuccessMailUseCase } from "#/application/interfaces/use-case/ISendBookingPaymentSuccessMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendBookingPaymentSuccessMailUseCase
  implements ISendBookingPaymentSuccessMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: BookingPaymentMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Booking Payment Successful - ShareMyRide`,
      body: `
      Hello ${data.firstName} ${data.lastName},

      Your payment for booking (ID: ${data.bookingId}) has been successfully processed and confirmed!

      Thank you for riding with ShareMyRide.
      `,
    };

    await this._mailService.send(notification);
  }
}
