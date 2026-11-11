import { IPayoutRepository } from "#/application/interfaces/repository/IPayoutRepository";
import { IAdminListPayoutsUseCase } from "#/application/interfaces/use-cases/payout/IAdminListPayoutsUseCase";
import { PayoutEntity } from "#/domain/entities/PayoutEntity";
import { PaginatedPayload, QueryDTO } from "@sharemyride/shared";

/**
 * Retrieves a paginated list of all payouts for admin review and approval
 */
export class AdminListPayoutsUseCase implements IAdminListPayoutsUseCase {
  constructor(private readonly _payoutRepository: IPayoutRepository) {}

  async execute(
    query: QueryDTO<PayoutEntity>,
  ): Promise<PaginatedPayload<PayoutEntity[]>> {
    return this._payoutRepository.find(query);
  }
}
