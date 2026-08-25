import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

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
