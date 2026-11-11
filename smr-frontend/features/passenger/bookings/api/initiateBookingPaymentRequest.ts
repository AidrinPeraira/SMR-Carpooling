import { apiClientFetch } from "@/lib/api-client";
import { InitiateBookingPaymentResponseDTO } from "@sharemyride/shared";

export type InitiateBookingPaymentResponse = InitiateBookingPaymentResponseDTO;

export async function initiateBookingPaymentRequest(
  bookingId: string,
): Promise<InitiateBookingPaymentResponseDTO> {
  const response = await apiClientFetch<InitiateBookingPaymentResponseDTO>(
    `/api/v1/bookings/${bookingId}/initiate-payment`,
    {
      method: "POST",
    },
  );

  if (response && response.success && response.payload) {
    return response.payload;
  }

  throw new Error(response.message || "Failed to initiate booking payment");
}
