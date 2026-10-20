import { AppConfig } from "#/application.config";
import { PasswordChangedMailDTO, PasswordChangeRequestMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";
import { IAuthEmailTemplateFactory } from "#/application/interfaces/templates/IAuthEmailTemplateFactory";
import { EmailTemplate } from "#/application/utils/EmailTemplate";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class AuthEmailTemplateFactory implements IAuthEmailTemplateFactory {
  createSignupVerificationNotification(data: SinupVerifcationMailRequestDTO): NotificationEntity {
    return {
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
  }

  createPasswordChangeRequestNotification(data: PasswordChangeRequestMailDTO): NotificationEntity {
    return {
      recipient: data.emailId,
      subject: `Password Reset Request - ShareMyRide`,
      body: EmailTemplate.generate(
        "Password Reset",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${AppConfig.FRONTEND_URL}/auth/change-password?token=${data.token}" class="button">Reset Password</a>
        <p>If you did not request this, you can safely ignore this email.</p>
        `
      ),
    };
  }

  createPasswordChangedNotification(data: PasswordChangedMailDTO): NotificationEntity {
    return {
      recipient: data.emailId,
      subject: `Password Changed Successfully - ShareMyRide`,
      body: EmailTemplate.generate(
        "Password Changed",
        `
        <p>Hello <strong>${data.userName}</strong>,</p>
        <p>Your password has been updated successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        `
      ),
    };
  }
}
