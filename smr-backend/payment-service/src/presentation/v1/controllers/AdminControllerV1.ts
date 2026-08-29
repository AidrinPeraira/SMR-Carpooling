import { AdminListTransactionsQueryDTO } from "#/application/dto/admin/AdminPaymentsDTO";
import { IAdminListTransactionsUseCase } from "#/application/interfaces/use-cases/admin/IAdminListTransactionsUseCase";
import { IAdminControllerV1 } from "#/presentation/v1/interfaces/IAdminControllerV1";
import { AdminMapper } from "#/presentation/v1/mapper/AdminMapper";
import {
  AdminListTransactionsSchema,
  AdminListTransactionsSchemaType,
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  PaymentSuccessMessage,
  zodParser,
} from "@sharemyride/shared";
import { Request, Response } from "express";

/**
 * Handles HTTP requests for admin-specific payment endpoints.
 * Express 5 async error propagation is used — no try/catch boilerplate needed.
 */
export class AdminControllerV1 implements IAdminControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _adminListTransactionsUseCase: IAdminListTransactionsUseCase,
  ) {}

  /**
   * GET /admin/transactions
   *
   * Returns a paginated, searchable, filterable, and sortable list of all
   * platform transactions. Intended for admin use only.
   *
   * Supports the following query parameters (all optional unless noted):
   *   - page    (number, default 1)
   *   - limit   (number, default 10)
   *   - search  (string) — searches across transactionId, creditor, debitor
   *   - searchFields (string[]) — specify which fields to search
   *   - sortField   (string) — field to sort by
   *   - sortValue   (asc | desc)
   *   - filterField (string) — field to filter by
   *   - filterValue (string) — exact value to match
   */
  async listTransactions(req: Request, res: Response): Promise<void> {
    const query = zodParser<AdminListTransactionsSchemaType>(
      AdminListTransactionsSchema,
      req.query,
    );

    this._logger.info("Admin: fetching all platform transactions", {
      page: query.page,
      limit: query.limit,
      search: query.search,
      sortField: query.sortField,
      filterField: query.filterField,
    });

    const dto: AdminListTransactionsQueryDTO = {
      limit: query.limit,
      page: query.page,
      search: query.search,
      searchFields: query.searchFields as AdminListTransactionsQueryDTO["searchFields"],
      sortField: query.sortField as AdminListTransactionsQueryDTO["sortField"],
      sortValue: query.sortValue,
      filterField: query.filterField as AdminListTransactionsQueryDTO["filterField"],
      filterValue: query.filterValue,
    };

    const result = await this._adminListTransactionsUseCase.execute(dto);

    this._logger.info("Admin: platform transactions fetched successfully", {
      totalItems: result.paginationMeta.totalItems,
    });

    res.status(HttpStatusCodes.Ok).json(
      makeSuccessResponse(
        PaymentSuccessMessage.TRANSACTIONS_FETCHED,
        AdminMapper.toListTransactionsResult(result),
      ),
    );
  }
}
