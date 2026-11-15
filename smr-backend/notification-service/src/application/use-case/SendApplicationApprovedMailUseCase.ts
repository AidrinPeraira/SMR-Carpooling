import { ApplicationApprovedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendApplicationApprovedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationApprovedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendApplicationApprovedMailUseCase
  implements ISendApplicationApprovedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: ApplicationApprovedMailDTO): Promise<void> {


    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Application Approved! - ShareMyRide`,
      body: EmailTemplate.generate(
        "Application Approved",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>Great news! Your application (<strong>${data.applicationType}</strong>) has been approved.</p>
        ${data.comment ? `<div class="comment-box"><p>Admin Comment: ${data.comment}</p></div>` : ''}
        <p>Thank you for being part of ShareMyRide.</p>
        `
      ),
    };

    await this._mailService.send(notification);
  }
}
