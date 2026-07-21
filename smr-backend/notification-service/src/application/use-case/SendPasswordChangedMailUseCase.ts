import { PasswordChangedMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendPasswordChangedMailUseCase } from "#/application/interfaces/use-case/ISendPasswordChangedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendPasswordChangedMailUseCase
  implements ISendPasswordChangedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: PasswordChangedMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Password Changed Successfully - ShareMyRide`,
      body: `
      Hello ${data.userName},

      Your password has been updated successfully.

      If you did not make this change, please contact support immediately.
      `,
    };

    await this._mailService.send(notification);
  }
}
