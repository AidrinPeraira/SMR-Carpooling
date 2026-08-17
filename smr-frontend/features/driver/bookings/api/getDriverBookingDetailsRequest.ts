import { apiClientFetch } from "@/lib/api-client";
import { DriverBookingDetailsDTO, TripStopDTO } from "@sharemyride/shared";

export type BookingStopDetails = TripStopDTO;
export type DriverBookingDetails = DriverBookingDetailsDTO;

export async function getDriverBookingDetailsRequest(
  bookingId: string,
): Promise<DriverBookingDetailsDTO> {
  const response = await apiClientFetch<DriverBookingDetailsDTO>(
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
