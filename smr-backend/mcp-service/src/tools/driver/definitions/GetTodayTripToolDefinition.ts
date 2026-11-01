import { z } from "zod";

export const GetTodayTripSchema = z.object({});

export const GetTodayTripToolDefinition = {
  title: "Get today's upcoming trip",
  description:
    "Check if the driver has a trip scheduled for today and return the next upcoming one. Returns trip details and passenger count, or nothing if there is no trip today",
  inputSchema: GetTodayTripSchema,
};
