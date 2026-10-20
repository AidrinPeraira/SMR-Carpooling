import { ApplicationApprovedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IApplicationEmailTemplateFactory } from "#/application/interfaces/templates/IApplicationEmailTemplateFactory";
import { ISendApplicationApprovedMailUseCase } from "#/application/interfaces/use-case/application/ISendApplicationApprovedMailUseCase";

export class SendApplicationApprovedMailUseCase implements ISendApplicationApprovedMailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IApplicationEmailTemplateFactory,
  ) {}

  async execute(data: ApplicationApprovedMailDTO): Promise<void> {
    const notification = this._templateFactory.createApplicationApprovedNotification(data);
    await this._mailService.send(notification);
  }
}
