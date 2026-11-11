export enum PayoutSuccessMessage {
  PAYOUT_CREATED = "Payout record created successfully",
  PAYOUT_COMPLETED = "Payout completed and credited to wallet",
  PAYOUTS_FETCHED = "Payouts fetched successfully",
}

export enum PayoutErrorMessage {
  PAYOUT_NOT_FOUND = "Payout record not found",
  PAYOUT_ALREADY_EXISTS = "A payout already exists for this booking",
  PAYOUT_ALREADY_COMPLETED = "Payout has already been completed",
  PAYOUT_NOT_PENDING = "Payout is not in a pending state",
  WALLET_NOT_FOUND = "Driver wallet not found",
}
