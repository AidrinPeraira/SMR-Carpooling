import { GatewayClient } from "#/services/GatewayService";
import type { ToolHandler } from "#/types/mcp.types";
import type { ListTripsResult, SearchTripRequest } from "@sharemyride/shared";

export const handleSearchTripToolCall: ToolHandler<SearchTripRequest> = async (
  input,
) => {
  const response = await GatewayClient.post<ListTripsResult[]>(
    "/api/v1/trips/search",
    input,
  );

  return {
    content: [{ type: "text", text: JSON.stringify(response.data) }],
  };
};
