import { AppConfig } from "#/application.config";
import { PasswordChangeRequestMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendPasswordChangeRequestMailUseCase } from "#/application/interfaces/use-case/ISendPasswordChangeRequestMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendPasswordChangeRequestMailUseCase implements ISendPasswordChangeRequestMailUseCase {
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: PasswordChangeRequestMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Password Reset Request - ShareMyRide`,
      body: `
      Hello ${data.userName},

      We received a request to reset your password. Click the link below to set a new password:
      ${AppConfig.FRONTEND_URL}/auth/change-password?token=${data.token}

      If you did not request this, you can safely ignore this email.
      `,
    };

    await this._mailService.send(notification);
  }
}
