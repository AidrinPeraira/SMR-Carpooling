import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";
import { PaymentMethod, TransactionStatus } from "@sharemyride/shared";

export const bookingPaymentSchema = new mongoose.Schema({
  bookingId: {
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
  },
  paymentKey: {
    type: String,
    required: true,
  },
  gatewayOrderId: {
    type: String,
  },
  gatewayPaymentId: {
    type: String,
  },
  gatewayVeificationKey: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.PAYMENT_GATEWAY,
  },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    default: TransactionStatus.PENDING,
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

export type BookingPaymentDoc = HydratedDocument<
  InferSchemaType<typeof bookingPaymentSchema>
>;

export const BookingPaymentModel = mongoose.model<BookingPaymentDoc>(
  "BookingPayment",
  bookingPaymentSchema,
);
