import { PasswordChangedMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendPasswordChangedMailUseCase } from "#/application/interfaces/use-case/ISendPasswordChangedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendPasswordChangedMailUseCase
  implements ISendPasswordChangedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: PasswordChangedMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Password Changed Successfully - ShareMyRide`,
      body: EmailTemplate.generate(
        "Password Changed",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>Your password has been updated successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        `
      ),
    };

    await this._mailService.send(notification);
  }
}
