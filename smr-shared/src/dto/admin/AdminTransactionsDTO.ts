import { PaymentMethod, TransactionCategory, TransactionType } from "../../enums";

/**
 * Represents a single transaction item in the admin paginated list response.
 * All property names use snake_case to conform to the API contract.
 */
export interface AdminTransactionItemDTO {
  transaction_id: string;
  transaction_date: Date;
  transaction_amount: number;

  creditor_id: string | null;
  creditor_name: string;

  debitor_id: string | null;
  debitor_name: string;

  payment_method: PaymentMethod;
  transaction_type: TransactionType;
  transaction_category: TransactionCategory;
  record_id: string;
}
