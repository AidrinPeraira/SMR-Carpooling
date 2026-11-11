import { apiClientFetch } from "@/lib/api-client";
import { DriverBookingItemDTO, PaginatedPayload } from "@sharemyride/shared";

export async function getDriverRecentBookingsRequest(): Promise<
  PaginatedPayload<DriverBookingItemDTO[]>
> {
  const response = await apiClientFetch<
    PaginatedPayload<DriverBookingItemDTO[]>
  >("/api/v1/bookings/driver?page=1&limit=5", {
    method: "GET",
  });

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch recent bookings");
  }

  return response.payload;
}
