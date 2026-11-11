/**
 * This checks the status of booking payment and if
 * the payment has been collected it issues a refund
 * via the wallet
 */
export interface IRefundBookingPaymentUseCase {
  execute(bookingId: string): Promise<void>;
}
