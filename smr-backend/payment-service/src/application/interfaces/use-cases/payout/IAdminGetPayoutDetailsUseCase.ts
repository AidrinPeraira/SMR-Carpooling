import { PayoutEntity } from "#/domain/entities/PayoutEntity";

/**
 * Retrieves a single payout by its ID for admin review,
 * including the associated booking payment details.
 */
export interface IAdminGetPayoutDetailsUseCase {
  execute(payoutId: string): Promise<PayoutEntity>;
}
