import { AppConfig } from "#/application.config";
import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ISendSignupVerificationMailUseCase } from "#/application/interfaces/use-case/ISendSignupVerificationMailUseCase";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

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
      body: `

      Hello there. Welcome.
  

      Click Here to complete the signup process: ${AppConfig.FRONTEND_URL}/auth/signup/verify?token=${data.verificationToken}


      `,
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
