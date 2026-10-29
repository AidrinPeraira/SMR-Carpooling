import { GatewayClient } from "#/services/GatewayService";
import { GetTodayTripSchema } from "#/tools/passenger/definitions/GetTodayTripToolDefinition";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
  type PassengerTodayTripResult,
} from "@sharemyride/shared";

export const handleGetTodayTripToolCall: ToolCallback<
  typeof GetTodayTripSchema
> = async (_input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.PASSENGER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_PASSENGER }],
      isError: true,
    };
  }

  const response = await GatewayClient.get<
    ApiResponse<PassengerTodayTripResult>
  >("/api/v1/bookings/passenger/today", {
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
