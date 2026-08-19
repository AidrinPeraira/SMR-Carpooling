import {
  PaymentMethod,
  TransactionCategory,
  TransactionType,
} from "@sharemyride/shared";

export interface TransactionEntity {
  transactionId: string;
  creditor: string;
  debitor: string;
  transactionType: TransactionType; // the type of transaction for the customer
  transactionCategory: TransactionCategory;
  paymentMethod: PaymentMethod;
  recordId: string;
}
