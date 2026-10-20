import {
  PasswordChangedMailDTO,
  PasswordChangeRequestMailDTO,
} from "#/application/dto/email/PasswordChangeMailDTO";
import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export interface IAuthEmailTemplateFactory {
  createSignupVerificationNotification(
    data: SinupVerifcationMailRequestDTO,
  ): NotificationEntity;

  createPasswordChangeRequestNotification(
    data: PasswordChangeRequestMailDTO,
  ): NotificationEntity;

  createPasswordChangedNotification(
    data: PasswordChangedMailDTO,
  ): NotificationEntity;
}
