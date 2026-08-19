export interface IPaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
}

/**
 * This service handles processing payments and transactions
 */
export interface IPaymentProvider {
  createOrder(
    amount: number,
    paymentId: string,
    currency?: string,
  ): Promise<IPaymentOrderResult>;

  /**
   * verifies the orderid and payment id with verification
   * key. if it fails throws an error
   */
  verifyPayment(
    orderId: string,
    paymentId: string,
    verificationKey: string,
  ): Promise<void>;
}
