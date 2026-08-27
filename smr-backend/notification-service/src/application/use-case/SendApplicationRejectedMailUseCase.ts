import { ApplicationRejectedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendApplicationRejectedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationRejectedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendApplicationRejectedMailUseCase
  implements ISendApplicationRejectedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: ApplicationRejectedMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Application Status Update - ShareMyRide`,
      body: EmailTemplate.generate(
        "Application Update",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>We regret to inform you that your application (<strong>${data.applicationType}</strong>) has been rejected.</p>
        ${data.comment ? `<div class="comment-box"><p>Reason / Comment: ${data.comment}</p></div>` : ''}
        <p>If you believe this is an error, please reach out to support.</p>
        `
      ),
    };

    await this._mailService.send(notification);
  }
}
