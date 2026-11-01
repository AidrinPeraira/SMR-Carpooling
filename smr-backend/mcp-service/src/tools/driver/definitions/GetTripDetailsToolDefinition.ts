import { z } from "zod";

export const GetTripDetailsSchema = z.object({
  tripId: z.string().describe("The ID of the trip to retrieve"),
});

export const GetTripDetailsToolDefinition = {
  title: "Get trip details",
  description:
    "Get the full details of a specific trip by its ID, including route, stops, confirmed passengers, available seats, and current status",
  inputSchema: GetTripDetailsSchema,
};
