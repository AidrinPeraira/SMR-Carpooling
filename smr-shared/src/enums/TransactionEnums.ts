export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum TransactionCategory {
  BOOKING_PAYMENT = "booking_payment",
  REFUND = "refund",
  PAYOUT = "payout",
  WALLET_TOPUP = "wallet_topup",
  WALLET_WITHDRAWAL = "wallet_withdrawal",
}

export enum PaymentMethod {
  WALLET = "wallet",
  PAYMENT_GATEWAY = "payment_gateway",
}

export enum TransactionStatus {
  PENDING = "pending",
  CANCELLED = "cancelled",
  FAILED = "failed",
  SUCCESS = "success",
}
