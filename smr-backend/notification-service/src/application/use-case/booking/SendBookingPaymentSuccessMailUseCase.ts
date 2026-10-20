import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IBookingEmailTemplateFactory } from "#/application/interfaces/templates/IBookingEmailTemplateFactory";
import { ISendBookingPaymentSuccessMailUseCase } from "#/application/interfaces/use-case/booking/ISendBookingPaymentSuccessMailUseCase";

export class SendBookingPaymentSuccessMailUseCase implements ISendBookingPaymentSuccessMailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IBookingEmailTemplateFactory,
  ) {}

  async execute(data: BookingPaymentMailDTO): Promise<void> {
    const notification = this._templateFactory.createBookingPaymentSuccessNotification(data);
    await this._mailService.send(notification);
  }
}
