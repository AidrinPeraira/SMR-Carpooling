import {
  AdminListTransactionsQueryDTO,
  AdminListTransactionsResultDTO,
} from "#/application/dto/admin/AdminPaymentsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This use case finds trnasactions accordin to search filter and sort queries
 * to return a paginated reponse of trannsactions
 */
export interface IAdminListTransactionsUseCase {
  execute(
    query: AdminListTransactionsQueryDTO,
  ): Promise<PaginatedPayload<AdminListTransactionsResultDTO[]>>;
}
