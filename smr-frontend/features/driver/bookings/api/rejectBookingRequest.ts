import { apiClientFetch } from "@/lib/api-client";

export async function rejectBookingRequest(bookingId: string): Promise<void> {
  const response = await apiClientFetch<null>(
    `/api/v1/bookings/${bookingId}/reject`,
    {
      method: "PATCH",
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to reject booking request");
  }
}
