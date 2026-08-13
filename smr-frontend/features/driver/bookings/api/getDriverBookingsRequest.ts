import { apiClientFetch } from "@/lib/api-client";
import { PaginatedPayload } from "@sharemyride/shared";

export interface DriverBookingItem {
  booking_id: string;
  passenger_name: string;
  trip_date: string;
  trip_vehicle: string;
  pickup_point_name: string;
  pickup_point_address: string;
  drop_off_point_name: string;
  drop_off_point_address: string;
  booking_distance: number;
  seat_count: number;
  status: string;
  total_price: number;
}

export async function getDriverBookingsRequest(params?: {
  booking_status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedPayload<DriverBookingItem[]>> {
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
    PaginatedPayload<DriverBookingItem[]>
  >(endpoint, {
    method: "GET",
  });

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch driver bookings");
  }

  return response.payload;
}
