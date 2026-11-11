import { AppConfig } from "#/application.config";
import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { IAuthEmailTemplateFactory } from "#/application/interfaces/templates/IAuthEmailTemplateFactory";
import { ISendSignupVerificationMailUseCase } from "#/application/interfaces/use-case/auth/ISendSignupVerificationMailUseCase";

export class SendSignupVerificationMailUseCase implements ISendSignupVerificationMailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: IAuthEmailTemplateFactory,
  ) {}

  async execute(data: SinupVerifcationMailRequestDTO): Promise<void> {
    const notification = this._templateFactory.createSignupVerificationNotification(data);

    if (AppConfig.NODE_ENV !== "production") {
      console.log(
        "Use this link to verify email: " +
          `${AppConfig.FRONTEND_URL}/auth/signup/verify?token=${data.verificationToken}`,
      );
    }

    await this._mailService.send(notification);
  }
}
