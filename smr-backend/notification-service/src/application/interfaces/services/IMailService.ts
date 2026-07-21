import { NotificationEntity } from "#/domain/entities/NotificationEntity";

/**
 * This is the interface fot the email service provider
 * It has the method to send emails only
 */
export interface IMailService {
  send(notification: NotificationEntity): Promise<void>;
}
