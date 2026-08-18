import { TransactionCategory, TransactionType } from "@sharemyride/shared";

export interface WalletTransactionEntity {
  id?: string;
  walletId: string;
  amount: number;
  transactionType: TransactionType;
  transactionCategory: TransactionCategory;
  transactionId: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
