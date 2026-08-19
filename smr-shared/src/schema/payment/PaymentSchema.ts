import { z } from "zod";

export const CreateBookingPaymentOrderSchema = z.object({
  payment_token: z.string({ error: "Payment token is required" }).min(1, "Payment token cannot be empty"),
});

export const VerifyBookingPaymentOrderSchema = z.object({
  order_number: z.string({ error: "Order number is required" }).min(1, "Order number cannot be empty"),
  payment_id: z.string({ error: "Payment ID is required" }).min(1, "Payment ID cannot be empty"),
  verification_key: z.string({ error: "Verification key is required" }).min(1, "Verification key cannot be empty"),
});
