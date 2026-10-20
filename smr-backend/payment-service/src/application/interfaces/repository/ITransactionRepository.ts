import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import {
  AdminListTransactionsQueryDTO,
  AdminListTransactionsResultDTO,
  GetTransactionsSummaryResponseDTO,
  GetRevenueTrendResponseDTO,
} from "#/application/dto/admin/AdminPaymentsDTO";
import { TransactionEntity } from "#/domain/entities/TransactionEntity";
import { PaginatedPayload, TrendRange } from "@sharemyride/shared";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {
  findAllPaginated(
    query: AdminListTransactionsQueryDTO,
  ): Promise<PaginatedPayload<AdminListTransactionsResultDTO[]>>;

  getCustomerEarnings(customerId: string): Promise<number>;

  getTransactionsSummary(): Promise<GetTransactionsSummaryResponseDTO>;

  getRevenueTrend(range: TrendRange): Promise<GetRevenueTrendResponseDTO>;
}

