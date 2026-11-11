import { PayBookingWithWalletRequestDTO } from "#/application/dto/payments/BookingPaymentDTO";

/**
 * This use case handles booking payments using wallets
 * and also publishing the necessary success and failure events
 */
export interface IPayBookingWithWalletUseCase {
  execute(dto: PayBookingWithWalletRequestDTO): Promise<void>;
}
