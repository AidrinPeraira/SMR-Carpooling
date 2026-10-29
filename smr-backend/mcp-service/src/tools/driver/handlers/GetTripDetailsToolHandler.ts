import { GatewayClient } from "#/services/GatewayService";
import { GetTripDetailsSchema } from "#/tools/driver/definitions/GetTripDetailsToolDefinition";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
  type DriverTripDetailsResult,
} from "@sharemyride/shared";

export const handleGetTripDetailsToolCall: ToolCallback<
  typeof GetTripDetailsSchema
> = async (input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.DRIVER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_DRIVER }],
      isError: true,
    };
  }

  const response = await GatewayClient.get<
    ApiResponse<DriverTripDetailsResult>
  >(`/api/v1/trips/driver/${input.tripId}`, {
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
