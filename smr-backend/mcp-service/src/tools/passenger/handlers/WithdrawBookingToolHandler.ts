import { GatewayClient } from "#/services/GatewayService";
import { WithdrawBookingSchema } from "#/tools/passenger/definitions/WithdrawBookingToolDefinition";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
} from "@sharemyride/shared";

export const handleWithdrawBookingToolCall: ToolCallback<
  typeof WithdrawBookingSchema
> = async (input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.PASSENGER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_PASSENGER }],
      isError: true,
    };
  }

  const response = await GatewayClient.patch<ApiResponse>(
    `/api/v1/bookings/${input.bookingId}/withdraw`,
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
