import { z } from "zod";

export const CancelBookingSchema = z.object({
  bookingId: z.string().describe("The ID of the confirmed booking to cancel"),
});

export const CancelBookingToolDefinition = {
  title: "Cancel a confirmed booking",
  description:
    "Cancel a booking that has already been accepted by the driver and confirmed with payment. Use this instead of withdraw-booking when the booking is in 'confirmed' status",
  inputSchema: CancelBookingSchema,
};
