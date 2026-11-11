import { CreateBookingSchema } from "@sharemyride/shared";

export const CreateBookingToolDefinition = {
  title: "Create a booking request",
  description:
    "Send a booking request to a driver for a specific trip. Requires the trip ID, pickup point, drop-off point, and number of seats. The booking stays pending until the driver accepts it",
  inputSchema: CreateBookingSchema,
};
