import * as z from "zod";
import { PaymentMethod, TransactionCategory, TransactionType } from "../../enums";
import { QuerySchema } from "../query/QuerySchema";

/**
 * Extends the base QuerySchema with transaction-specific filterField/filterValue
 * constraints for the admin list-transactions endpoint.
 */
export const AdminListTransactionsSchema = QuerySchema.extend({
  filterField: z
    .enum([
      "paymentMethod",
      "transactionType",
      "transactionCategory",
      "creditor",
      "debitor",
      "recordId",
    ] as const)
    .optional(),
  filterValue: z
    .union([
      z.enum(PaymentMethod),
      z.enum(TransactionType),
      z.enum(TransactionCategory),
      z.string().trim().min(1),
    ])
    .optional(),
  sortField: z
    .enum([
      "transactionId",
      "createdAt",
      "amount",
      "paymentMethod",
      "transactionType",
      "transactionCategory",
      "creditor",
      "debitor",
    ] as const)
    .optional(),
});

export type AdminListTransactionsSchemaType = z.infer<typeof AdminListTransactionsSchema>;
