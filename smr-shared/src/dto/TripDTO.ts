import { BookingStatus, TripStatus, VehicleTypes } from "../enums";
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

export interface DriverTripItemDTO {
  trip_id: string;
  trip_origin: string;
  trip_destination: string;
  vehicle_make: string;
  vehicle_model: string;
  available_seats: number;
  vacant_seats: number;
  start_time: string;
  trip_status: TripStatus;
}

export interface DriverTripBookingDetailsDTO {
  booking_id: string;
  passenger_name: string;
  booking_status: BookingStatus;
  seat_count: number;
}

export interface DriverTripDetailsDTO {
  trip_id: string;
  trip_date: string;
  trip_vehicle: string;
  trip_vehicle_image: string;
  trip_route: Route[];
  trip_origin: TripStopDTO;
  trip_destination: TripStopDTO;
  trip_stops: TripStopDTO[];
  start_time: string;
  trip_status: TripStatus;
  trip_bookings: DriverTripBookingDetailsDTO[];
}
