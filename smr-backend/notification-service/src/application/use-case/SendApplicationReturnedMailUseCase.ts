import { ApplicationReturnedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendApplicationReturnedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationReturnedMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

export class SendApplicationReturnedMailUseCase
  implements ISendApplicationReturnedMailUseCase
{
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: ApplicationReturnedMailDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Application Action Required - ShareMyRide`,
      body: EmailTemplate.generate(
        "Action Required",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>Your application (<strong>${data.applicationType}</strong>) requires updates and has been returned for correction.</p>
        ${data.comment ? `<div class="comment-box"><p>Admin Comment: ${data.comment}</p></div>` : ''}
        <p>Please log in to your account and resubmit the application with updated details/documents.</p>
        <a href="https://sharemyride.com/login" class="button">Log In to Account</a>
        `
      ),
    };

    await this._mailService.send(notification);
  }
}
