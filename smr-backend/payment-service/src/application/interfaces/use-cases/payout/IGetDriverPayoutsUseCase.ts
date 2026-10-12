import { PayoutEntity } from "#/domain/entities/PayoutEntity";
import { PaginatedPayload, QueryDTO } from "@sharemyride/shared";

/**
 * This use case retrieves a paginated list of payouts
 * belonging to a specific driver.
 */
export interface IGetDriverPayoutsUseCase {
  execute(
    driverId: string,
    query: QueryDTO<PayoutEntity>,
  ): Promise<PaginatedPayload<PayoutEntity[]>>;
}
