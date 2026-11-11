import { apiClientFetch } from "@/lib/api-client";
import { PassengerBookingDetailsDTO } from "@sharemyride/shared";

export type PassengerBookingDetails = PassengerBookingDetailsDTO;

export async function getPassengerBookingDetailsRequest(
  bookingId: string,
): Promise<PassengerBookingDetailsDTO> {
  const response = await apiClientFetch<PassengerBookingDetailsDTO>(
    `/api/v1/bookings/passenger/${bookingId}`,
    {
      method: "GET",
    },
  );

  if (response && response.success && response.payload) {
    return response.payload;
  }

  throw new Error(response.message || "Failed to fetch passenger booking details");
}
