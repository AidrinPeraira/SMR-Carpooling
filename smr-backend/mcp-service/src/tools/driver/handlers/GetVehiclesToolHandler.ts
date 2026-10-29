import { GatewayClient } from "#/services/GatewayService";
import { GetVehiclesSchema } from "#/tools/driver/definitions/GetVehiclesToolDefinition";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
  type VehicleRecordResult,
} from "@sharemyride/shared";

export const handleGetVehiclesToolCall: ToolCallback<
  typeof GetVehiclesSchema
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
    ApiResponse<VehicleRecordResult[]>
  >("/api/v1/vehicles", {
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
