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
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const walletSchema = new mongoose.Schema({
  walletId: {
    type: String,
    required: true,
    unique: true,
  },

  customerId: {
    type: String,
    required: true,
    unique: true,
  },

  balance: {
    type: Number,
    required: true,
    default: 0,
  },

  walletTransactions: [walletTransactionSchema],

  createdAt: {
    type: Date,
    required: true,
  },

  updatedAt: {
    type: Date,
    required: true,
  },
});

export type WalletDoc = HydratedDocument<
  InferSchemaType<typeof walletSchema>
>;

export const WalletModel = mongoose.model<WalletDoc>("Wallet", walletSchema);
