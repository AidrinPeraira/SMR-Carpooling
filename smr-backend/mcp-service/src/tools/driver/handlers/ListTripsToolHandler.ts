import { GatewayClient } from "#/services/GatewayService";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
  type DriverGetTripsQuerySchema,
  type DriverTripItemResult,
} from "@sharemyride/shared";

export const handleListTripsToolCall: ToolCallback<
  typeof DriverGetTripsQuerySchema
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
    ApiResponse<DriverTripItemResult[]>
  >("/api/v1/trips/driver", {
    headers: { Authorization: authToken },
    params: input,
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
