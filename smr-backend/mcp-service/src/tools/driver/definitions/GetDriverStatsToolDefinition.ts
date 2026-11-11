import { z } from "zod";

export const GetDriverStatsSchema = z.object({});

export const GetDriverStatsToolDefinition = {
  title: "Get driver statistics",
  description:
    "Get aggregated statistics about the driver's activity, including total trips created, completed trips, total passengers carried, and earnings overview",
  inputSchema: GetDriverStatsSchema,
};
