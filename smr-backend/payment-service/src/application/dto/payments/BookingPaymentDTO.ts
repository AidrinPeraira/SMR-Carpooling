export interface CreateBookingPaymentOrderRequestDTO {
  paymentToken: string;
}

export interface CreateBookingPaymentOrderResponseDTO {
  orderNumber: string;
}

export interface VerifyBookingPaymentOrderRequestDTO {
  orderNumber: string;
  paymentId: string;
  verificationKey: string;
}
