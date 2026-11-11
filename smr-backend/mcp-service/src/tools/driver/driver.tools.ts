import { CreateTripToolDefinition } from "#/tools/driver/definitions/CreateTripToolDefinition";
import { ListTripsToolDefinition } from "#/tools/driver/definitions/ListTripsToolDefinition";
import { GetTripDetailsToolDefinition } from "#/tools/driver/definitions/GetTripDetailsToolDefinition";
import { CancelTripToolDefinition } from "#/tools/driver/definitions/CancelTripToolDefinition";
import { GetTodayTripToolDefinition } from "#/tools/driver/definitions/GetTodayTripToolDefinition";
import { ListBookingsToolDefinition } from "#/tools/driver/definitions/ListBookingsToolDefinition";
import { GetBookingDetailsToolDefinition } from "#/tools/driver/definitions/GetBookingDetailsToolDefinition";
import { AcceptBookingToolDefinition } from "#/tools/driver/definitions/AcceptBookingToolDefinition";
import { RejectBookingToolDefinition } from "#/tools/driver/definitions/RejectBookingToolDefinition";
import { GetDriverStatsToolDefinition } from "#/tools/driver/definitions/GetDriverStatsToolDefinition";
import { GetVehiclesToolDefinition } from "#/tools/driver/definitions/GetVehiclesToolDefinition";
import { handleCreateTripToolCall } from "#/tools/driver/handlers/CreateTripToolHandler";
import { handleListTripsToolCall } from "#/tools/driver/handlers/ListTripsToolHandler";
import { handleGetTripDetailsToolCall } from "#/tools/driver/handlers/GetTripDetailsToolHandler";
import { handleCancelTripToolCall } from "#/tools/driver/handlers/CancelTripToolHandler";
import { handleGetTodayTripToolCall } from "#/tools/driver/handlers/GetTodayTripToolHandler";
import { handleListBookingsToolCall } from "#/tools/driver/handlers/ListBookingsToolHandler";
import { handleGetBookingDetailsToolCall } from "#/tools/driver/handlers/GetBookingDetailsToolHandler";
import { handleAcceptBookingToolCall } from "#/tools/driver/handlers/AcceptBookingToolHandler";
import { handleRejectBookingToolCall } from "#/tools/driver/handlers/RejectBookingToolHandler";
import { handleGetDriverStatsToolCall } from "#/tools/driver/handlers/GetDriverStatsToolHandler";
import { handleGetVehiclesToolCall } from "#/tools/driver/handlers/GetVehiclesToolHandler";
import { McpServer } from "@modelcontextprotocol/server";

export function registerDriverTools(server: McpServer): void {
  server.registerTool("create-trip", CreateTripToolDefinition, handleCreateTripToolCall);
  server.registerTool("list-trips", ListTripsToolDefinition, handleListTripsToolCall);
  server.registerTool("get-trip-details", GetTripDetailsToolDefinition, handleGetTripDetailsToolCall);
  server.registerTool("cancel-trip", CancelTripToolDefinition, handleCancelTripToolCall);
  server.registerTool("get-today-trip", GetTodayTripToolDefinition, handleGetTodayTripToolCall);
  server.registerTool("list-bookings", ListBookingsToolDefinition, handleListBookingsToolCall);
  server.registerTool("get-booking-details", GetBookingDetailsToolDefinition, handleGetBookingDetailsToolCall);
  server.registerTool("accept-booking", AcceptBookingToolDefinition, handleAcceptBookingToolCall);
  server.registerTool("reject-booking", RejectBookingToolDefinition, handleRejectBookingToolCall);
  server.registerTool("get-driver-stats", GetDriverStatsToolDefinition, handleGetDriverStatsToolCall);
  server.registerTool("get-vehicles", GetVehiclesToolDefinition, handleGetVehiclesToolCall);
}
