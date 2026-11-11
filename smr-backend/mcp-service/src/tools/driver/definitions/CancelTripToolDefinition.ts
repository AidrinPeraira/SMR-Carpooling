import { z } from "zod";

export const CancelTripSchema = z.object({
  tripId: z.string().describe("The ID of the trip to cancel"),
});

export const CancelTripToolDefinition = {
  title: "Cancel a scheduled trip",
  description:
    "Cancel a trip that has not yet started. All confirmed bookings on this trip will also be cancelled and affected passengers will be notified",
  inputSchema: CancelTripSchema,
};
