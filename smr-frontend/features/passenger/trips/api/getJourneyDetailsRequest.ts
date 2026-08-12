import { apiClientFetch } from "@/lib/api-client";
import { Route, TripStopDTO } from "@sharemyride/shared";

export interface GetJourneyDetailsResponse {
  trip_id: string;
  trip_stops: TripStopDTO[];
  trip_route: Route[];
  available_stops: Route[];
  base_price: number;
  price_per_km: number;
}

export async function getJourneyDetailsRequest(
  tripId: string,
): Promise<GetJourneyDetailsResponse> {
  const response = await apiClientFetch<GetJourneyDetailsResponse>(
    "/api/v1/trips/journey-details",
    {
      method: "POST",
      body: JSON.stringify({ trip_id: tripId }),
    },
  );

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to get journey details");
  }

  return response.payload;
}
