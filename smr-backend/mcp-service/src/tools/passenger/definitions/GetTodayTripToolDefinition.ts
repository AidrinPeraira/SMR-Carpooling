import { z } from "zod";

export const GetTodayTripSchema = z.object({});

export const GetTodayTripToolDefinition = {
  title: "Get today's confirmed trip",
  description:
    "Check if the passenger has a confirmed trip scheduled for today. Returns the trip and booking details, or nothing if there is no trip today",
  inputSchema: GetTodayTripSchema,
};
