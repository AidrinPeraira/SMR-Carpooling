export interface CreateBookingPaymentOrderRequest {
  payment_token: string;
}

export interface CreateBookingPaymentOrderResult {
  order_number: string;
}

export interface VerifyBookingPaymentOrderRequest {
  order_number: string;
  payment_id: string;
  verification_key: string;
}

export interface PayBookingWithWalletRequest {
  payment_token: string;
}
