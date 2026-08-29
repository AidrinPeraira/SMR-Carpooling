import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";
import {
  PaymentMethod,
  TransactionCategory,
  TransactionType,
} from "@sharemyride/shared";

export const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    creditor: {
      type: String,
      required: true,
    },
    debitor: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    transactionCategory: {
      type: String,
      enum: Object.values(TransactionCategory),
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    recordId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export type TransactionDoc = HydratedDocument<
  InferSchemaType<typeof transactionSchema>
>;

export const TransactionModel = mongoose.model<TransactionDoc>(
  "Transaction",
  transactionSchema,
);

