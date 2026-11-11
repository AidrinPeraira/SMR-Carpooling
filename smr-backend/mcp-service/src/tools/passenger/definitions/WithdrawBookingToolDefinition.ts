import { z } from "zod";

export const WithdrawBookingSchema = z.object({
  bookingId: z.string().describe("The ID of the booking to withdraw"),
});

export const WithdrawBookingToolDefinition = {
  title: "Withdraw a pending booking request",
  description:
    "Withdraw a booking request that is still in 'pending' status and has not yet been accepted by the driver. Use this instead of cancel-booking when the booking has not been confirmed yet",
  inputSchema: WithdrawBookingSchema,
};
