import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendBookingPaymentSuccessMailUseCase } from "#/application/interfaces/use-case/ISendBookingPaymentSuccessMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendBookingPaymentSuccessMailUseCase
  implements ISendBookingPaymentSuccessMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: BookingPaymentMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Booking Payment Successful - ShareMyRide`,
      body: EmailTemplate.generate(
        "Payment Successful",
        `
        <p>Hello <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p>Your payment for booking (ID: <strong>${data.bookingId}</strong>) has been successfully processed and confirmed!</p>
        <p>Thank you for riding with ShareMyRide.</p>
        <a href="https://sharemyride.com/bookings" class="button">View Booking</a>
        `
      ),
    };

    await this._mailService.send(notification);
  }
}
