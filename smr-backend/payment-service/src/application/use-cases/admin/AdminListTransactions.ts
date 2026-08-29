import {
  AdminListTransactionsQueryDTO,
  AdminListTransactionsResultDTO,
} from "#/application/dto/admin/AdminPaymentsDTO";
import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { IAdminListTransactionsUseCase } from "#/application/interfaces/use-cases/admin/IAdminListTransactionsUseCase";
import { PaginatedPayload } from "@sharemyride/shared";

export class AdminListTransactionsUseCase implements IAdminListTransactionsUseCase {
  constructor(
    private readonly transactionsRepository: ITransactionRepository,
  ) {}

  /**
   * Executes a paginated query for all platform transactions.
   * Delegates search, filter, and sort resolution to the repository layer.
   *
   * @param query - Pagination, search, filter and sort parameters from the controller
   * @returns Paginated list of transaction result DTOs
   */
  async execute(
    query: AdminListTransactionsQueryDTO,
  ): Promise<PaginatedPayload<AdminListTransactionsResultDTO[]>> {
    return this.transactionsRepository.findAllPaginated(query);
  }
}

