import { VehicleTypes } from "../enums";
import { Route } from "../types";

export interface TripStopDTO {
  stop_lat: number;
  stop_lng: number;
  stop_name: string;
  stop_address: string;
}

export interface ListTripsResult {
  trip_id: string;
  trip_origin: TripStopDTO;
  trip_destination: TripStopDTO;
  trip_distance: number;
  seats_available: number;
  time: Date;
  vehicle_type: VehicleTypes;
}

export interface GetJourneyDetailsResult {
  trip_id: string;
  trip_stops: TripStopDTO[];
  trip_route: Route[];
  available_stops: Route[];
  base_price: number;
  price_per_km: number;
}
