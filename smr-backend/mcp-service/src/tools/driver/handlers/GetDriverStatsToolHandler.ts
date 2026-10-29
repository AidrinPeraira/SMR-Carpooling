import { GatewayClient } from "#/services/GatewayService";
import { GetDriverStatsSchema } from "#/tools/driver/definitions/GetDriverStatsToolDefinition";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
  type DriverTripStatsResult,
} from "@sharemyride/shared";

export const handleGetDriverStatsToolCall: ToolCallback<
  typeof GetDriverStatsSchema
> = async (_input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.DRIVER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_DRIVER }],
      isError: true,
    };
  }

  const response = await GatewayClient.get<
    ApiResponse<DriverTripStatsResult>
  >("/api/v1/driver/stats", {
    headers: { Authorization: authToken },
  });

  if (!response.data.success) {
    return {
      content: [{ type: "text", text: JSON.stringify(response.data) }],
      isError: true,
    };
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response.data) }],
  };
};
