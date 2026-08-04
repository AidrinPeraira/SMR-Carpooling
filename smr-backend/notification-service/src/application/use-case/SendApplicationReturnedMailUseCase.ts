import { ApplicationReturnedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendApplicationReturnedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationReturnedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class SendApplicationReturnedMailUseCase
  implements ISendApplicationReturnedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: ApplicationReturnedMailDTO): Promise<void> {
    const commentText = data.comment
      ? `\n\nAdmin Comment: "${data.comment}"`
      : "";

    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Application Action Required - ShareMyRide`,
      body: `
      Hello ${data.userName},

      Your application (${data.applicationType}) requires updates and has been returned for correction.${commentText}

      Please log in to your account and resubmit the application with updated details/documents.
      `,
    };

    await this._mailService.send(notification);
  }
}
