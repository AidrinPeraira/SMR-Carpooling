import { BookingStatus } from "../../enums";
import { Route } from "../../types";
import { TripStopDTO } from "../TripDTO";

export interface AdminBookingItemDTO {
  booking_id: string;
  passenger_name: string;
  booking_origin: string;
  booking_destination: string;
  status: BookingStatus;
  trip_date: string | Date;
}

export interface AdminBookingDetailsDTO {
  booking_id: string;

  trip_id: string;
  trip_date: string;
  trip_origin: TripStopDTO;
  trip_destination: TripStopDTO;
  trip_route: Route;
  vehicle_name: string;

  passenger_id: string;
  passenger_name: string;

  booking_status: BookingStatus;
  booking_origin: TripStopDTO;
  booking_destination: TripStopDTO;
  distance_km: number;
  seat_count: number;
  total_price: number;
}
