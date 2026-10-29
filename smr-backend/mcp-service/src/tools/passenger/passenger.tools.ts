import { SearchTripToolDefinition } from "#/tools/passenger/definitions/SearchTripToolDefinition";
import { GetJourneyDetailsToolDefinition } from "#/tools/passenger/definitions/GetJourneyDetailsToolDefinition";
import { CreateBookingToolDefinition } from "#/tools/passenger/definitions/CreateBookingToolDefinition";
import { ListBookingsToolDefinition } from "#/tools/passenger/definitions/ListBookingsToolDefinition";
import { GetBookingDetailsToolDefinition } from "#/tools/passenger/definitions/GetBookingDetailsToolDefinition";
import { WithdrawBookingToolDefinition } from "#/tools/passenger/definitions/WithdrawBookingToolDefinition";
import { CancelBookingToolDefinition } from "#/tools/passenger/definitions/CancelBookingToolDefinition";
import { GetTodayTripToolDefinition } from "#/tools/passenger/definitions/GetTodayTripToolDefinition";
import { GetBookingStatsToolDefinition } from "#/tools/passenger/definitions/GetBookingStatsToolDefinition";
import { handleSearchTripToolCall } from "#/tools/passenger/handlers/SearchTripToolHandler";
import { handleGetJourneyDetailsToolCall } from "#/tools/passenger/handlers/GetJourneyDetailsToolHandler";
import { handleCreateBookingToolCall } from "#/tools/passenger/handlers/CreateBookingToolHandler";
import { handleListBookingsToolCall } from "#/tools/passenger/handlers/ListBookingsToolHandler";
import { handleGetBookingDetailsToolCall } from "#/tools/passenger/handlers/GetBookingDetailsToolHandler";
import { handleWithdrawBookingToolCall } from "#/tools/passenger/handlers/WithdrawBookingToolHandler";
import { handleCancelBookingToolCall } from "#/tools/passenger/handlers/CancelBookingToolHandler";
import { handleGetTodayTripToolCall } from "#/tools/passenger/handlers/GetTodayTripToolHandler";
import { handleGetBookingStatsToolCall } from "#/tools/passenger/handlers/GetBookingStatsToolHandler";
import { McpServer } from "@modelcontextprotocol/server";

export function registerPassengerTools(server: McpServer): void {
  server.registerTool("search-trips", SearchTripToolDefinition, handleSearchTripToolCall);
  server.registerTool("get-trip-fare-details", GetJourneyDetailsToolDefinition, handleGetJourneyDetailsToolCall);
  server.registerTool("create-booking", CreateBookingToolDefinition, handleCreateBookingToolCall);
  server.registerTool("list-bookings", ListBookingsToolDefinition, handleListBookingsToolCall);
  server.registerTool("get-booking-details", GetBookingDetailsToolDefinition, handleGetBookingDetailsToolCall);
  server.registerTool("withdraw-booking", WithdrawBookingToolDefinition, handleWithdrawBookingToolCall);
  server.registerTool("cancel-booking", CancelBookingToolDefinition, handleCancelBookingToolCall);
  server.registerTool("get-today-trip", GetTodayTripToolDefinition, handleGetTodayTripToolCall);
  server.registerTool("get-booking-stats", GetBookingStatsToolDefinition, handleGetBookingStatsToolCall);
}
