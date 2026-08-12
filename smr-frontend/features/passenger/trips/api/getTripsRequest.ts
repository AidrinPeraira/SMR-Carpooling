import { apiClientFetch } from "@/lib/api-client";
import {
  ListTripsResult,
  PaginatedPayload,
  SearchTripSchemaType,
} from "@sharemyride/shared";

export async function getTripsRequest(
  data: SearchTripSchemaType,
): Promise<PaginatedPayload<ListTripsResult[]>> {
  const response = await apiClientFetch<PaginatedPayload<ListTripsResult[]>>(
    "/api/v1/trips/search",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to search trips");
  }

  return response.payload;
}
