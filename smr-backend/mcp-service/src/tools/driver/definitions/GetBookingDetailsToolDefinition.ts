import { z } from "zod";

export const GetBookingDetailsSchema = z.object({
  bookingId: z.string().describe("The ID of the booking to retrieve"),
});

export const GetBookingDetailsToolDefinition = {
  title: "Get booking request details",
  description:
    "Get the full details of a specific booking request by its ID, including passenger info, pickup/drop-off points, seat count, and current status",
  inputSchema: GetBookingDetailsSchema,
};
