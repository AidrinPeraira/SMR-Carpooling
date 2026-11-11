import { PasswordChangeRequestMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IAuthEmailTemplateFactory } from "#/application/interfaces/templates/IAuthEmailTemplateFactory";
import { ISendPasswordChangeRequestMailUseCase } from "#/application/interfaces/use-case/auth/ISendPasswordChangeRequestMailUseCase";

export class SendPasswordChangeRequestMailUseCase implements ISendPasswordChangeRequestMailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IAuthEmailTemplateFactory,
  ) {}

  async execute(data: PasswordChangeRequestMailDTO): Promise<void> {
    const notification = this._templateFactory.createPasswordChangeRequestNotification(data);
    await this._mailService.send(notification);
  }
}
