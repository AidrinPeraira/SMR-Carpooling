import { z } from "zod";

export const GetBookingDetailsSchema = z.object({
  bookingId: z.string().describe("The ID of the booking to retrieve"),
});

export const GetBookingDetailsToolDefinition = {
  title: "Get booking details",
  description:
    "Get the full details of a specific booking by its ID, including trip info, driver details, pickup/drop-off points, status, and payment info",
  inputSchema: GetBookingDetailsSchema,
};
