import {
  ApplicationApprovedMailDTO,
  ApplicationRejectedMailDTO,
  ApplicationReturnedMailDTO,
} from "#/application/dto/email/ApplicationNotificationMailDTO";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export interface IApplicationEmailTemplateFactory {
  createApplicationApprovedNotification(
    data: ApplicationApprovedMailDTO,
  ): NotificationEntity;

  createApplicationRejectedNotification(
    data: ApplicationRejectedMailDTO,
  ): NotificationEntity;

  createApplicationReturnedNotification(
    data: ApplicationReturnedMailDTO,
  ): NotificationEntity;
}
