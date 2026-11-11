import { GetWalletTransactionsResponseDTO } from "#/application/dto/wallet/WalletTransactionsDTO";
import { GetWalletTransactionsResult, WalletTransactionItemDTO } from "@sharemyride/shared";

export class WalletMapper {
  static toGetWalletTransactionsResult(
    dto: GetWalletTransactionsResponseDTO,
  ): GetWalletTransactionsResult {
    return {
      wallet_id: dto.walletId,
      wallet_balance: dto.walletBalance,
      transactions: {
        paginationMeta: dto.transactions.paginationMeta,
        data: dto.transactions.data.map(
          (t): WalletTransactionItemDTO => ({
            id: t.id,
            amount: t.amount,
            transaction_type: t.transactionType,
            transaction_category: t.transactionCategory,
            transaction_id: t.transactionId,
            date: t.date,
          }),
        ),
      },
    };
  }
}
