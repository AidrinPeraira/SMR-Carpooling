import { apiClientFetch } from "@/lib/api-client";
import { PassengerTodayTripResult } from "@sharemyride/shared";

export async function getPassengerTodayTripRequest(): Promise<PassengerTodayTripResult | null> {
  const response = await apiClientFetch<PassengerTodayTripResult | null>(
    "/api/v1/bookings/passenger/today",
    { method: "GET" },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch today's trip");
  }

  return response.payload ?? null;
}
