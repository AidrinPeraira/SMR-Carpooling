import { apiClientFetch } from "@/lib/api-client";

export async function withdrawBookingRequest(bookingId: string): Promise<void> {
  const response = await apiClientFetch(`/api/v1/bookings/${bookingId}/withdraw`, {
    method: "PATCH",
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to withdraw booking request");
  }
}
