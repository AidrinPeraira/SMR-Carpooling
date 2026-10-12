/**
 * This use case approves a pending payout, creates the
 * transaction and credits the driver's wallet.
 */
export interface IApprovePayoutUseCase {
  execute(payoutId: string): Promise<void>;
}
