import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendBookingPaymentFailedMailUseCase } from "#/application/interfaces/use-case/ISendBookingPaymentFailedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendBookingPaymentFailedMailUseCase
  implements ISendBookingPaymentFailedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: BookingPaymentMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Booking Payment Failed - ShareMyRide`,
      body: EmailTemplate.generate(
        "Payment Failed",
        `
        <p>Hello <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p>Your payment for booking (ID: <strong>${data.bookingId}</strong>) failed or timed out.</p>
        <p>The reserved seats for this booking have been released. If you wish to try again, please initiate a new payment or re-book your ride.</p>
        <a href="https://sharemyride.com/bookings" class="button">Go to Bookings</a>
        `
      ),
    };

    await this._mailService.send(notification);
  }
}
