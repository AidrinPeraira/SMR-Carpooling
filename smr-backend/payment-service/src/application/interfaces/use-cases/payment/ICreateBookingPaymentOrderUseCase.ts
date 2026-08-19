import {
  CreateBookingPaymentOrderRequestDTO,
  CreateBookingPaymentOrderResponseDTO,
} from "#/application/dto/payments/BookingPaymentDTO";

/**
 * This use case takes booking data from client,
 * creates a booking payment record and creates order
 * to process the payment
 */
export interface ICreateBookingPaymentOrderUseCase {
  execute(
    dto: CreateBookingPaymentOrderRequestDTO,
  ): Promise<CreateBookingPaymentOrderResponseDTO>;
}
