import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";
import { PayoutStatus } from "@sharemyride/shared";

export const payoutSchema = new mongoose.Schema(
  {
    payoutId: {
      type: String,
      required: true,
      unique: true,
    },
    tripId: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    driverId: {
      type: String,
      required: true,
    },
    passengerId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    commision: {
      type: Number,
      required: true,
      default: 0,
    },
    payable: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(PayoutStatus),
      required: true,
      default: PayoutStatus.PENDING,
    },
    refTransactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export type PayoutDoc = HydratedDocument<
  InferSchemaType<typeof payoutSchema>
>;

export const PayoutModel = mongoose.model<PayoutDoc>(
  "Payout",
  payoutSchema,
);
