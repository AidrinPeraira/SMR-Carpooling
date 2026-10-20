import {
  ApplicationApprovedMailDTO,
  ApplicationRejectedMailDTO,
  ApplicationReturnedMailDTO,
} from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IApplicationEmailTemplateFactory } from "#/application/interfaces/templates/IApplicationEmailTemplateFactory";
import { EmailTemplate } from "#/application/utils/EmailTemplate";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class ApplicationEmailTemplateFactory implements IApplicationEmailTemplateFactory {
  createApplicationApprovedNotification(
    data: ApplicationApprovedMailDTO,
  ): NotificationEntity {
    return {
      recipient: data.emailId,
      subject: `Application Approved! - ShareMyRide`,
      body: EmailTemplate.generate(
        "Application Approved",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>Great news! Your application (<strong>${data.applicationType}</strong>) has been approved.</p>
        ${data.comment ? `<div class="comment-box"><p>Admin Comment: ${data.comment}</p></div>` : ""}
        <p>Thank you for being part of ShareMyRide.</p>
        `,
      ),
    };
  }

  createApplicationRejectedNotification(
    data: ApplicationRejectedMailDTO,
  ): NotificationEntity {
    return {
      recipient: data.emailId,
      subject: `Application Status Update - ShareMyRide`,
      body: EmailTemplate.generate(
        "Application Update",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>We regret to inform you that your application (<strong>${data.applicationType}</strong>) has been rejected.</p>
        ${data.comment ? `<div class="comment-box"><p>Reason / Comment: ${data.comment}</p></div>` : ""}
        <p>If you believe this is an error, please reach out to support.</p>
        `,
      ),
    };
  }

  createApplicationReturnedNotification(
    data: ApplicationReturnedMailDTO,
  ): NotificationEntity {
    return {
      recipient: data.emailId,
      subject: `Application Action Required - ShareMyRide`,
      body: EmailTemplate.generate(
        "Action Required",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>Your application (<strong>${data.applicationType}</strong>) requires updates and has been returned for correction.</p>
        ${data.comment ? `<div class="comment-box"><p>Admin Comment: ${data.comment}</p></div>` : ""}
        <p>Please log in to your account and resubmit the application with updated details/documents.</p>
        <a href="https://sharemyride.com/login" class="button">Log In to Account</a>
        `,
      ),
    };
  }
}
