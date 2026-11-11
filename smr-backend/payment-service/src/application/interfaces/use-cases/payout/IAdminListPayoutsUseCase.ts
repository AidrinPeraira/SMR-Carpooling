import { PayoutEntity } from "#/domain/entities/PayoutEntity";
import { PaginatedPayload, QueryDTO } from "@sharemyride/shared";

/**
 * This use case finds payouts according to query parameters
 * to return a paginated response for admin review.
 */
export interface IAdminListPayoutsUseCase {
  execute(
    query: QueryDTO<PayoutEntity>,
  ): Promise<PaginatedPayload<PayoutEntity[]>>;
}
