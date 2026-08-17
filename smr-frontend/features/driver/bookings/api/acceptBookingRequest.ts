import { apiClientFetch } from "@/lib/api-client";

export async function acceptBookingRequest(bookingId: string): Promise<void> {
  const response = await apiClientFetch<null>(
    `/api/v1/bookings/${bookingId}/accept`,
    {
      method: "PATCH",
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to accept booking request");
  }
}
