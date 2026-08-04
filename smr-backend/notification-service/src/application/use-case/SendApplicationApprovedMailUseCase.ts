import { ApplicationApprovedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendApplicationApprovedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationApprovedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendApplicationApprovedMailUseCase
  implements ISendApplicationApprovedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: ApplicationApprovedMailDTO): Promise<void> {
    const commentText = data.comment
      ? `\n\nAdmin Comment: "${data.comment}"`
      : "";

    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Application Approved! - ShareMyRide`,
      body: `
      Hello ${data.userName},

      Great news! Your application (${data.applicationType}) has been approved.${commentText}

      Thank you for being part of ShareMyRide.
      `,
    };

    await this._mailService.send(notification);
  }
}
