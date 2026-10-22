import type { ToolDefinition } from "#/types/mcp.types";
import { SearchTripSchema } from "@sharemyride/shared";

export const SearchTripToolDefinition: ToolDefinition<typeof SearchTripSchema> =
  {
    title: "Search available trips tool for passengers",
    description: "Search for available trips",
    inputSchema: SearchTripSchema,
  };
