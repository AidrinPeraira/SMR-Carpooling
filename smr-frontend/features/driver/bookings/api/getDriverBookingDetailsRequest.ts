import { apiClientFetch } from "@/lib/api-client";
import { Route } from "@sharemyride/shared";

export interface BookingStopDetails {
  stop_id: string;
  stop_name: string;
  stop_address: string;
  stop_lat: number;
  stop_lng: number;
}

export interface DriverBookingDetails {
  booking_id: string;
  passenger_name: string;
  trip_date: string;
  trip_vehicle: string;
  trip_route: Route;
  pickup_point: BookingStopDetails;
  drop_off_point: BookingStopDetails;
  booking_distance: number;
  seat_count: number;
  status: string;
  total_price: number;
}

export async function getDriverBookingDetailsRequest(
  bookingId: string,
): Promise<DriverBookingDetails> {
  const response = await apiClientFetch<DriverBookingDetails>(
    `/api/v1/bookings/driver/${bookingId}`,
    {
      method: "GET",
    },
  );

  if (response && response.success && response.payload) {
    return response.payload;
  }

  throw new Error(response.message || "Failed to fetch booking details");
}
