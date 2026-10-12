import { apiClientFetch } from "@/lib/api-client";
import { PassengerBookingItemDTO, PaginatedPayload } from "@sharemyride/shared";

export async function getPassengerRecentBookingsRequest(): Promise<
  PaginatedPayload<PassengerBookingItemDTO[]>
> {
  const response = await apiClientFetch<
    PaginatedPayload<PassengerBookingItemDTO[]>
  >("/api/v1/bookings/passenger?page=1&limit=5", {
    method: "GET",
  });

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch recent bookings");
  }

  return response.payload;
}
