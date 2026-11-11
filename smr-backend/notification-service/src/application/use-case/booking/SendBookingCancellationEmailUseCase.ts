import { BookingCancellationMailDTO } from "#/application/dto/email/BookingCancellationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IBookingEmailTemplateFactory } from "#/application/interfaces/templates/IBookingEmailTemplateFactory";
import { ISendBookingCancellationEmailUseCase } from "#/application/interfaces/use-case/booking/ISendBookingCancellationEmailUseCase";

export class SendBookingCancellationEmailUseCase implements ISendBookingCancellationEmailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IBookingEmailTemplateFactory,
  ) {}

  async execute(data: BookingCancellationMailDTO): Promise<void> {
    const notifications = this._templateFactory.createBookingCancellationNotifications(data);
    await Promise.all(notifications.map((n) => this._mailService.send(n)));
  }
}
