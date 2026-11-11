import { ApplicationReturnedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IApplicationEmailTemplateFactory } from "#/application/interfaces/templates/IApplicationEmailTemplateFactory";
import { ISendApplicationReturnedMailUseCase } from "#/application/interfaces/use-case/application/ISendApplicationReturnedMailUseCase";

export class SendApplicationReturnedMailUseCase implements ISendApplicationReturnedMailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IApplicationEmailTemplateFactory,
  ) {}

  async execute(data: ApplicationReturnedMailDTO): Promise<void> {
    const notification = this._templateFactory.createApplicationReturnedNotification(data);
    await this._mailService.send(notification);
  }
}
