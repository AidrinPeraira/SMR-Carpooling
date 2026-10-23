import { SearchTripSchema } from "@sharemyride/shared";
import { z } from "zod";

const MCPSearchTripSchema = SearchTripSchema.extend({
  time: z.string().datetime(),
});

export const SearchTripToolDefinition = {
  title: "Search available trips tool for passengers",
  description: "Search for available trips",
  inputSchema: MCPSearchTripSchema,
};
