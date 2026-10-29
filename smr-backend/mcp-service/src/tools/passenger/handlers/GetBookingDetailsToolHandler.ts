import { GatewayClient } from "#/services/GatewayService";
import { GetBookingDetailsSchema } from "#/tools/passenger/definitions/GetBookingDetailsToolDefinition";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
  type PassengerBookingDetailsResult,
} from "@sharemyride/shared";

export const handleGetBookingDetailsToolCall: ToolCallback<
  typeof GetBookingDetailsSchema
> = async (input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.PASSENGER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_PASSENGER }],
      isError: true,
    };
  }

  const response = await GatewayClient.get<
    ApiResponse<PassengerBookingDetailsResult>
  >(`/api/v1/bookings/passenger/${input.bookingId}`, {
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
