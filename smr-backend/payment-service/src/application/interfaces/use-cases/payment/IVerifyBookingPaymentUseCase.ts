import { VerifyBookingPaymentOrderRequestDTO } from "#/application/dto/payments/BookingPaymentDTO";

/**
 * This use case verifies the payment credentials through the payment service
 * provider and publishes corresponding success or failure event
 */
export interface IVerifyBookingPaymentUseCase {
  execute(dto: VerifyBookingPaymentOrderRequestDTO): Promise<void>;
}
