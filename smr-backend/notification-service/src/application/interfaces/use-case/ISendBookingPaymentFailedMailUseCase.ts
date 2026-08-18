import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";

export interface ISendBookingPaymentFailedMailUseCase {
  execute(data: BookingPaymentMailDTO): Promise<void>;
}
