import { SearchTripSchema } from "@sharemyride/shared";
import { z } from "zod";

export const MCPSearchTripSchema = SearchTripSchema.extend({
  time: z.string().datetime(),
});

export const SearchTripToolDefinition = {
  title: "Search available trips",
  description:
    "Search for available trips matching an origin, destination, and departure time. Use this when the passenger wants to find rides to a location",
  inputSchema: MCPSearchTripSchema,
};
