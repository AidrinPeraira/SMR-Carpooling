import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export const walletTransactionSchema = new mongoose.Schema({
  walletId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
  },
  transactionCategory: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export type WalletTransactionDoc = HydratedDocument<
  InferSchemaType<typeof walletTransactionSchema>
>;

export const WalletTransactionModel = mongoose.model<WalletTransactionDoc>(
  "WalletTransaction",
  walletTransactionSchema,
);
