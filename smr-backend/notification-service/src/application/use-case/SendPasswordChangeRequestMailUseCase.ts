import { AppConfig } from "#/application.config";
import { PasswordChangeRequestMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendPasswordChangeRequestMailUseCase } from "#/application/interfaces/use-case/ISendPasswordChangeRequestMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendPasswordChangeRequestMailUseCase implements ISendPasswordChangeRequestMailUseCase {
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: PasswordChangeRequestMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Password Reset Request - ShareMyRide`,
      body: EmailTemplate.generate(
        "Password Reset",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${AppConfig.FRONTEND_URL}/auth/change-password?token=${data.token}" class="button">Reset Password</a>
        <p>If you did not request this, you can safely ignore this email.</p>
        `
      ),
    };

    await this._mailService.send(notification);
  }
}
