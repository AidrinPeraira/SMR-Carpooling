import { apiClientFetch } from "@/lib/api-client";
import { PaginatedPayload, PassengerBookingItemDTO } from "@sharemyride/shared";

export type PassengerBookingItem = PassengerBookingItemDTO;

export async function getPassengerBookingsRequest(params?: {
  booking_status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedPayload<PassengerBookingItemDTO[]>> {
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
  const endpoint = `/api/v1/bookings/passenger${queryString ? `?${queryString}` : ""}`;

  const response = await apiClientFetch<
    PaginatedPayload<PassengerBookingItemDTO[]>
  >(endpoint, {
    method: "GET",
  });

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch passenger bookings");
  }

  return response.payload;
}
