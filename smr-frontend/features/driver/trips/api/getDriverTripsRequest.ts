import { apiClientFetch } from "@/lib/api-client";
import { DriverTripItemDTO, PaginatedPayload } from "@sharemyride/shared";

export type DriverTripItem = DriverTripItemDTO;

export async function getDriverTripsRequest(params?: {
  trip_status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedPayload<DriverTripItemDTO[]>> {
  const queryParams = new URLSearchParams();

  if (params?.trip_status && params.trip_status !== "all") {
    queryParams.append("trip_status", params.trip_status);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/api/v1/trips/driver${queryString ? `?${queryString}` : ""}`;

  const response = await apiClientFetch<
    PaginatedPayload<DriverTripItemDTO[]>
  >(endpoint, {
    method: "GET",
  });

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch driver trips");
  }

  return response.payload;
}
