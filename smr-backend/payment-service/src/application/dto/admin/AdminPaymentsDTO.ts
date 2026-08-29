import { PaymentMethod, QueryDTO, TransactionCategory, TransactionType } from "@sharemyride/shared";

export type AdminListTransactionsQueryDTO =
  QueryDTO<AdminListTransactionsResultDTO>;

export interface AdminListTransactionsResultDTO {
  transactionId: string;
  transactionDate: Date;
  transactionAmount: number;

  creditorId: string | null;
  creditorName: string;

  debitorId: string | null;
  debitorName: string;

  paymentMethod: PaymentMethod;
  transactionType: TransactionType;
  transactionCategory: TransactionCategory;
  recordId: string;
}

