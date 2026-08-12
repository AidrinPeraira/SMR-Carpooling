import { VehicleTypes } from "../enums";

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
