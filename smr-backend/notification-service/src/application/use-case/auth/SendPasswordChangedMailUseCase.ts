import { PasswordChangedMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IAuthEmailTemplateFactory } from "#/application/interfaces/templates/IAuthEmailTemplateFactory";
import { ISendPasswordChangedMailUseCase } from "#/application/interfaces/use-case/auth/ISendPasswordChangedMailUseCase";

export class SendPasswordChangedMailUseCase implements ISendPasswordChangedMailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IAuthEmailTemplateFactory,
  ) {}

  async execute(data: PasswordChangedMailDTO): Promise<void> {
    const notification = this._templateFactory.createPasswordChangedNotification(data);
    await this._mailService.send(notification);
  }
}
