import { AppConfig } from "#/application.config";
import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendSignupVerificationMailUseCase } from "#/application/interfaces/use-case/ISendSignupVerificationMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";
import { EmailTemplate } from "#/application/utils/EmailTemplate";

/**
 * This use case gets the validated and mapped data form the event consumer
 * It then crafts a notification object using the data and calls the email service
 * to send the data
 */
export class SendSignupVerificationMailUseCase implements ISendSignupVerificationMailUseCase {
  constructor(private readonly _mailService: IMailService) {}

  async execute(data: SinupVerifcationMailRequestDTO): Promise<void> {
    const notification: NotificationEntity = {
      recipient: data.emailId,
      subject: `Welcome to ShareMyRide, ${data.userName}`,
      body: EmailTemplate.generate(
        "Welcome to ShareMyRide",
        `
        <p>Hello <strong>${data.userName}</strong>. Welcome to the platform!</p>
        <p>To get started and complete your signup process, please verify your email address.</p>
        <a href="${AppConfig.FRONTEND_URL}/auth/signup/verify?token=${data.verificationToken}" class="button">Verify Email Address</a>
        `
      ),
    };

    //delete this for production
    if (AppConfig.NODE_ENV !== "production") {
      console.log(
        "Use this link to verify email: " +
          `${AppConfig.FRONTEND_URL}/auth/signup/verify?token=${data.verificationToken}`,
      );
    }

    await this._mailService.send(notification);
  }
}
