import { z } from "zod";

export const RejectBookingSchema = z.object({
  bookingId: z.string().describe("The ID of the booking request to reject"),
});

export const RejectBookingToolDefinition = {
  title: "Reject a booking request",
  description:
    "Reject a pending booking request from a passenger. The passenger will be notified that their request was declined",
  inputSchema: RejectBookingSchema,
};
