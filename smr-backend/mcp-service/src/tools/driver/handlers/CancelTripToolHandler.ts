import { GatewayClient } from "#/services/GatewayService";
import { CancelTripSchema } from "#/tools/driver/definitions/CancelTripToolDefinition";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
} from "@sharemyride/shared";

export const handleCancelTripToolCall: ToolCallback<
  typeof CancelTripSchema
> = async (input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.DRIVER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_DRIVER }],
      isError: true,
    };
  }

  const response = await GatewayClient.patch<ApiResponse>(
    `/api/v1/trips/driver/${input.tripId}/cancel`,
    {},
    { headers: { Authorization: authToken } },
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
};
