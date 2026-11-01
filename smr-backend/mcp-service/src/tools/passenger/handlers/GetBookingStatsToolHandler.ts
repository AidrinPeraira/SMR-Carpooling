import { GatewayClient } from "#/services/GatewayService";
import { GetBookingStatsSchema } from "#/tools/passenger/definitions/GetBookingStatsToolDefinition";
import { logger } from "#/services/LoggerService";
import type { ToolCallback } from "@modelcontextprotocol/server";
import {
  UserRole,
  UserErrorMessage,
  type ApiResponse,
  type PassengerBookingStatsResult,
} from "@sharemyride/shared";

export const handleGetBookingStatsToolCall: ToolCallback<
  typeof GetBookingStatsSchema
> = async (_input, ctx) => {
  const authToken = ctx.http?.req?.headers.get("authorization");
  const userRole = ctx.http?.req?.headers.get("x-user-role");

  if (userRole !== UserRole.PASSENGER) {
    return {
      content: [{ type: "text", text: UserErrorMessage.NOT_A_PASSENGER }],
      isError: true,
    };
  }

  try {
    const response = await GatewayClient.get<
      ApiResponse<PassengerBookingStatsResult>
    >("/api/v1/bookings/passenger/stats", {
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
  } catch (error) {
    logger.error("get-booking-stats tool failed", error instanceof Error ? error.message : error);
    return {
      content: [{ type: "text", text: "Something went wrong. Please try again later." }],
      isError: true,
    };
  }
};
