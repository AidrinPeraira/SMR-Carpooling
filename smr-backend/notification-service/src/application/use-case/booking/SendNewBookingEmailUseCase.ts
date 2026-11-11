import { NewBookingMailDTO } from "#/application/dto/email/NewBookingMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IBookingEmailTemplateFactory } from "#/application/interfaces/templates/IBookingEmailTemplateFactory";
import { ISendNewBookingEmailUseCase } from "#/application/interfaces/use-case/booking/ISendNewBookingEmailUseCase";

export class SendNewBookingEmailUseCase implements ISendNewBookingEmailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IBookingEmailTemplateFactory,
  ) {}

  async execute(data: NewBookingMailDTO): Promise<void> {
    const notifications = this._templateFactory.createNewBookingNotifications(data);
    await Promise.all(notifications.map((n) => this._mailService.send(n)));
  }
}
