import { AdminListTransactionsResultDTO } from "#/application/dto/admin/AdminPaymentsDTO";
import {
  AdminTransactionItemDTO,
  PaginatedPayload,
} from "@sharemyride/shared";

/**
 * Maps internal application DTOs to the external API contract types (snake_case).
 * All mapping from camelCase internal DTOs to snake_case API response shapes lives here.
 */
export class AdminMapper {
  /**
   * Maps a PaginatedPayload of internal AdminListTransactionsResultDTO items
   * to a PaginatedPayload of snake_case AdminTransactionItemDTO for the API response.
   *
   * @param payload - Paginated internal result from the use case
   * @returns Paginated API response conforming to AdminTransactionItemDTO
   */
  static toListTransactionsResult(
    payload: PaginatedPayload<AdminListTransactionsResultDTO[]>,
  ): PaginatedPayload<AdminTransactionItemDTO[]> {
    return {
      paginationMeta: payload.paginationMeta,
      data: payload.data.map(
        (item): AdminTransactionItemDTO => ({
          transaction_id: item.transactionId,
          transaction_date: item.transactionDate,
          transaction_amount: item.transactionAmount,
          creditor_id: item.creditorId,
          creditor_name: item.creditorName,
          debitor_id: item.debitorId,
          debitor_name: item.debitorName,
          payment_method: item.paymentMethod,
          transaction_type: item.transactionType,
          transaction_category: item.transactionCategory,
          record_id: item.recordId,
        }),
      ),
    };
  }
}
