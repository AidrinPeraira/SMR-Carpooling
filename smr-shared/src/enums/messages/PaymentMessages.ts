export enum PaymentSuccessMessage {
  ORDER_CREATED = "Payment order created successfully",
  PAYMENT_VERIFIED = "Payment verified successfully",
}

export enum PaymentErrorMessage {
  PAYMENT_NOT_FOUND = "Payment record not found",
  INVALID_PAYMENT_TOKEN = "Invalid or expired payment token",
  VERIFICATION_FAILED = "Payment verification failed",
  ORDER_CREATION_FAILED = "Failed to create payment order",
  PAYMENT_WINDOW_EXPIRED = "Payment window has expired",
}
