import { z } from "zod";

export const GetBookingStatsSchema = z.object({});

export const GetBookingStatsToolDefinition = {
  title: "Get booking statistics",
  description:
    "Get aggregated statistics about the passenger's bookings, including counts by status (confirmed, completed, cancelled) and total trips taken",
  inputSchema: GetBookingStatsSchema,
};
