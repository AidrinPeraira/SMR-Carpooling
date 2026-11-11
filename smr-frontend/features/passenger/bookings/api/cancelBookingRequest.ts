import { apiClientFetch } from "@/lib/api-client";

export async function cancelBookingRequest(bookingId: string): Promise<void> {
  const response = await apiClientFetch(`/api/v1/bookings/${bookingId}/cancel`, {
    method: "PATCH",
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to cancel booking");
  }
}
