import { DriverGetTripsQuerySchema } from "@sharemyride/shared";

export const ListTripsToolDefinition = {
  title: "List my trips",
  description:
    "List trips created by the driver. Can filter by status (scheduled, in_progress, completed, cancelled). Use this to see trip history or check on upcoming trips",
  inputSchema: DriverGetTripsQuerySchema,
};
