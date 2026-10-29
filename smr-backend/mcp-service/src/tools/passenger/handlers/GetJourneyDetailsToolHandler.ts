import { GatewayClient } from "#/services/GatewayService";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
  type GetJourneyDetailsSchema,
  type GetJourneyDetailsResult,
} from "@sharemyride/shared";

export const handleGetJourneyDetailsToolCall: ToolCallback<
  typeof GetJourneyDetailsSchema
> = async (input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.PASSENGER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_PASSENGER }],
      isError: true,
    };
  }

  const response = await GatewayClient.post<
    ApiResponse<GetJourneyDetailsResult>
  >("/api/v1/trips/journey-details", input, {
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
