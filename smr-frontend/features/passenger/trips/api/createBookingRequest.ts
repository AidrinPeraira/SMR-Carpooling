import { apiClientFetch } from "@/lib/api-client";
import { CreateBookingSchemaType } from "@sharemyride/shared";

export async function createBookingRequest(
  payload: CreateBookingSchemaType,
): Promise<void> {
  const response = await apiClientFetch("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to create booking request");
  }
}
