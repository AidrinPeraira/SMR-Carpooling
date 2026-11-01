import { PassengerGetBookingsQuerySchema } from "@sharemyride/shared";

export const ListBookingsToolDefinition = {
  title: "List my bookings",
  description:
    "List the passenger's bookings. Can filter by status (pending, confirmed, completed, cancelled, withdrawn). Use this to see booking history or check on current bookings",
  inputSchema: PassengerGetBookingsQuerySchema,
};
