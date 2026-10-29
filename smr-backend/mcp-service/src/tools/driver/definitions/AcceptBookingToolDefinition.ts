import { z } from "zod";

export const AcceptBookingSchema = z.object({
  bookingId: z.string().describe("The ID of the booking request to accept"),
});

export const AcceptBookingToolDefinition = {
  title: "Accept a booking request",
  description:
    "Accept a pending booking request from a passenger. The passenger will be notified and can proceed to pay for the confirmed booking",
  inputSchema: AcceptBookingSchema,
};
