import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import {
  AdminListTransactionsQueryDTO,
  AdminListTransactionsResultDTO,
} from "#/application/dto/admin/AdminPaymentsDTO";
import { TransactionEntity } from "#/domain/entities/TransactionEntity";
import { PaginatedPayload } from "@sharemyride/shared";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {
  /**
   * Retrieves a paginated, searchable, filterable, and sortable list
   * of all platform transactions for admin reporting purposes.
   *
   * @param query - Pagination, search, filter, and sort parameters
   * @returns Paginated list of AdminListTransactionsResultDTO
   */
  findAllPaginated(
    query: AdminListTransactionsQueryDTO,
  ): Promise<PaginatedPayload<AdminListTransactionsResultDTO[]>>;
}

