import { DriverGetBookingsQuerySchema } from "@sharemyride/shared";

export const ListBookingsToolDefinition = {
  title: "List booking requests",
  description:
    "List passenger booking requests across the driver's trips. Can filter by status (pending, confirmed, completed, cancelled, rejected). Use this to see who wants to join your trips",
  inputSchema: DriverGetBookingsQuerySchema,
};
