import { TripCancellationMailDTO } from "#/application/dto/email/TripCancellationMailDTO";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export interface ITripEmailTemplateFactory {
  createTripCancellationNotifications(
    data: TripCancellationMailDTO,
  ): NotificationEntity[];
}
