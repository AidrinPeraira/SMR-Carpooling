import { AppConfig } from "#/application.config";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { ILogger } from "@smr/shared";
import { Resend } from "resend";

export class ResendEmailService implements IMailService {
  private readonly _resendMailer;
  constructor(private readonly _logger: ILogger) {
    this._resendMailer = new Resend(AppConfig.RESEND_API_KEY);
  }

  async send(notification: NotificationEntity): Promise<void> {
    this._logger.info("Sending email notification: ", notification.subject);

    const { data, error } = await this._resendMailer.emails.send({
      from: AppConfig.RESEND_EMAIL_FROM,
      to: notification.recipient,
      subject: notification.subject,
      html: notification.body,
    });

    if (error) {
      this._logger.info("Error sending notification email: ", error);
    } else {
      this._logger.info("Notication mail send successfully: ", data);
    }
  }
}
