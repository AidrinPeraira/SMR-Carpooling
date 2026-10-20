import { ApplicationRejectedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IApplicationEmailTemplateFactory } from "#/application/interfaces/templates/IApplicationEmailTemplateFactory";
import { ISendApplicationRejectedMailUseCase } from "#/application/interfaces/use-case/application/ISendApplicationRejectedMailUseCase";

export class SendApplicationRejectedMailUseCase implements ISendApplicationRejectedMailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IApplicationEmailTemplateFactory,
  ) {}

  async execute(data: ApplicationRejectedMailDTO): Promise<void> {
    const notification = this._templateFactory.createApplicationRejectedNotification(data);
    await this._mailService.send(notification);
  }
}
