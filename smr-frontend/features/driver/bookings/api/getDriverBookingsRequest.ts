import { apiClientFetch } from "@/lib/api-client";
import { DriverBookingItemDTO, PaginatedPayload } from "@sharemyride/shared";

export type DriverBookingItem = DriverBookingItemDTO;

export async function getDriverBookingsRequest(params?: {
  booking_status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedPayload<DriverBookingItemDTO[]>> {
  const queryParams = new URLSearchParams();

  if (params?.booking_status && params.booking_status !== "all") {
    queryParams.append("booking_status", params.booking_status);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/api/v1/bookings/driver${queryString ? `?${queryString}` : ""}`;

  const response = await apiClientFetch<
    PaginatedPayload<DriverBookingItemDTO[]>
  >(endpoint, {
    method: "GET",
  });

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch driver bookings");
  }

  return response.payload;
}
