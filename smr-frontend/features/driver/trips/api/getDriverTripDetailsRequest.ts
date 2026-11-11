import { apiClientFetch } from "@/lib/api-client";
import { DriverTripDetailsDTO } from "@sharemyride/shared";

export type DriverTripDetails = DriverTripDetailsDTO;

export async function getDriverTripDetailsRequest(
  tripId: string,
): Promise<DriverTripDetailsDTO> {
  const response = await apiClientFetch<DriverTripDetailsDTO>(
    `/api/v1/trips/driver/${tripId}`,
    {
      method: "GET",
    },
  );

  if (response && response.success && response.payload) {
    return response.payload;
  }

  throw new Error(response.message || "Failed to fetch driver trip details");
}
