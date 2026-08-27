import { BookingCancellationMailDTO } from "#/application/dto/email/BookingCancellationMailDTO";

export interface ISendBookingCancellationEmailUseCase {
  execute(data: BookingCancellationMailDTO): Promise<void>;
}
