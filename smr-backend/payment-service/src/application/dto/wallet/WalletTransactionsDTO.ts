import {
  PaginatedPayload,
  QueryDTO,
  TransactionCategory,
  TransactionType,
} from "@sharemyride/shared";

export type GetWalletTransactionsQueryDTO = QueryDTO<WalletTransactionDTO>;

export interface GetWalletTransactionsResponseDTO {
  walletId: string;
  walletBalance: number;
  transactions: PaginatedPayload<WalletTransactionDTO[]>;
}

export interface WalletTransactionDTO {
  id: string;
  amount: number;
  transactionType: TransactionType;
  transactionCategory: TransactionCategory;
  transactionId: string;
  date: Date;
}
