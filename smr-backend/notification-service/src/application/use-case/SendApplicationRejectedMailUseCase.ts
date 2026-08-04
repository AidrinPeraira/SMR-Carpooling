import { ApplicationRejectedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendApplicationRejectedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationRejectedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendApplicationRejectedMailUseCase
  implements ISendApplicationRejectedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: ApplicationRejectedMailDTO): Promise<void> {
    const commentText = data.comment
      ? `\n\nReason / Comment: "${data.comment}"`
      : "";

    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Application Status Update - ShareMyRide`,
      body: `
      Hello ${data.userName},

      We regret to inform you that your application (${data.applicationType}) has been rejected.${commentText}

      If you believe this is an error, please reach out to support.
      `,
    };

    await this._mailService.send(notification);
  }
}
