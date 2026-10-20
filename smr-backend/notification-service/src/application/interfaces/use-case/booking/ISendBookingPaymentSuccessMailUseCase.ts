import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";

export interface ISendBookingPaymentSuccessMailUseCase {
  execute(data: BookingPaymentMailDTO): Promise<void>;
}
