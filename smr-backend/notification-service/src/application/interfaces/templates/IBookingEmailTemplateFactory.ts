import { BookingCancellationMailDTO } from "#/application/dto/email/BookingCancellationMailDTO";
import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { NewBookingMailDTO } from "#/application/dto/email/NewBookingMailDTO";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export interface IBookingEmailTemplateFactory {
  createNewBookingNotifications(data: NewBookingMailDTO): NotificationEntity[];

  createBookingCancellationNotifications(
    data: BookingCancellationMailDTO,
  ): NotificationEntity[];

  createBookingPaymentSuccessNotification(
    data: BookingPaymentMailDTO,
  ): NotificationEntity;

  createBookingPaymentFailedNotification(
    data: BookingPaymentMailDTO,
  ): NotificationEntity;
}
