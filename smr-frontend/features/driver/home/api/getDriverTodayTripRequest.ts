import { apiClientFetch } from "@/lib/api-client";
import { DriverTodayTripResult } from "@sharemyride/shared";

export async function getDriverTodayTripRequest(): Promise<DriverTodayTripResult | null> {
  const response = await apiClientFetch<DriverTodayTripResult | null>(
    "/api/v1/trips/driver/today",
    { method: "GET" },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch today's trip");
  }

  return response.payload ?? null;
}
