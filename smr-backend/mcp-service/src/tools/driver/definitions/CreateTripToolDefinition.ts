import { CreateTripSchema } from "@sharemyride/shared";
import { z } from "zod";

export const MCPCreateTripSchema = CreateTripSchema.extend({
  start_time: z.string().datetime(),
});

export const CreateTripToolDefinition = {
  title: "Create and publish a new trip",
  description:
    "Publish a new ride for passengers to find and book. Requires origin, destination, intermediate stops, route, vehicle, departure time, and available seats",
  inputSchema: MCPCreateTripSchema,
};
