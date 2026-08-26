import { PaginatedPayload, TransactionCategory, TransactionType } from "../index";

export interface WalletTransactionItemDTO {
  id: string;
  amount: number;
  transaction_type: TransactionType;
  transaction_category: TransactionCategory;
  transaction_id: string;
  date: Date;
}

export interface GetWalletTransactionsResult {
  wallet_id: string;
  wallet_balance: number;
  transactions: PaginatedPayload<WalletTransactionItemDTO[]>;
}
