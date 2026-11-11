import { IPayoutRepository } from "#/application/interfaces/repository/IPayoutRepository";
import { IGetDriverPayoutsUseCase } from "#/application/interfaces/use-cases/payout/IGetDriverPayoutsUseCase";
import { PayoutEntity } from "#/domain/entities/PayoutEntity";
import { PaginatedPayload, QueryDTO } from "@sharemyride/shared";

/**
 * Retrieves a paginated list of payouts for a specific driver
 */
export class GetDriverPayoutsUseCase implements IGetDriverPayoutsUseCase {
  constructor(private readonly _payoutRepository: IPayoutRepository) {}

  async execute(
    driverId: string,
    query: QueryDTO<PayoutEntity>,
  ): Promise<PaginatedPayload<PayoutEntity[]>> {
    return this._payoutRepository.findByDriverId(driverId, query);
  }
}
