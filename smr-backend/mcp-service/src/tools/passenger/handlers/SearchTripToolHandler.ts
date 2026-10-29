import { GatewayClient } from "#/services/GatewayService";
import { MCPSearchTripSchema } from "#/tools/passenger/definitions/SearchTripToolDefinition";
import { logger } from "#/services/LoggerService";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserErrorMessage,
  UserRole,
  type ApiResponse,
  type ListTripsResult,
} from "@sharemyride/shared";

export const handleSearchTripToolCall: ToolCallback<
  typeof MCPSearchTripSchema
> = async (input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.PASSENGER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_PASSENGER }],
      isError: true,
    };
  }

  try {
    const response = await GatewayClient.post<ApiResponse<ListTripsResult[]>>(
      "/api/v1/trips/search",
      input,
      {
        headers: {
          Authorization: authToken,
        },
      },
    );

    if (!response.data.success) {
      return {
        content: [{ type: "text", text: JSON.stringify(response.data) }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(response.data) }],
    };
  } catch (error) {
    logger.error("search-trips tool failed", error instanceof Error ? error.message : error);
    return {
      content: [{ type: "text", text: "Something went wrong. Please try again later." }],
      isError: true,
    };
  }
};
