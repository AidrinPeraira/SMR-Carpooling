export enum PaymentSuccessMessage {
  ORDER_CREATED = "Payment order created successfully",
  PAYMENT_VERIFIED = "Payment verified successfully",
  PAYMENT_COMPLETED = "Payment completed successfully",
  TRANSACTIONS_FETCHED = "Transactions fetched successfully",
}


export enum PaymentErrorMessage {
  PAYMENT_ALREADY_COMPLETED = "Payment already completed",
  PAYMENT_NOT_FOUND = "Payment record not found",
  INVALID_PAYMENT_TOKEN = "Invalid or expired payment token",
  VERIFICATION_FAILED = "Payment verification failed",
  ORDER_CREATION_FAILED = "Failed to create payment order",
  PAYMENT_WINDOW_EXPIRED = "Payment window has expired",
  WALLET_NOT_FOUND = "Wallet record not found",
  PAYMENT_ALREADY_INITIATED = "Payment has already been initiated via another method",
  PAYMENT_CANCELLED = "Payment has been cancelled",
  INSUFFICIENT_WALLET_BALANCE = "User does not have enough balance to complete the payment",
}
