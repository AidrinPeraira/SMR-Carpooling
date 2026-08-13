import { Route } from "../types";
import { TripStopDTO } from "./TripDTO";

export interface DriverBookingItemDTO {
  booking_id: string;
  passenger_name: string;
  trip_date: string;
  trip_vehicle: string;
  pickup_point_name: string;
  pickup_point_address: string;
  drop_off_point_name: string;
  drop_off_point_address: string;
  booking_distance: number;
  seat_count: number;
  status: string;
  total_price: number;
}

export interface DriverBookingDetailsDTO {
  booking_id: string;
  passenger_name: string;
  trip_date: string;
  trip_vehicle: string;
  trip_route: Route;
  pickup_point: TripStopDTO;
  drop_off_point: TripStopDTO;
  booking_distance: number;
  seat_count: number;
  status: string;
  total_price: number;
}

export interface PassengerBookingItemDTO {
  booking_id: string;
  driver_name: string;
  trip_date: string;
  trip_vehicle: string;
  pickup_point_name: string;
  pickup_point_address: string;
  drop_off_point_name: string;
  drop_off_point_address: string;
  booking_distance: number;
  seat_count: number;
  status: string;
  total_price: number;
}

export interface PassengerBookingDetailsDTO {
  booking_id: string;
  driver_name: string;
  trip_date: string;
  trip_vehicle: string;
  trip_vehicle_image: string;
  trip_route: Route;
  pickup_point: TripStopDTO;
  drop_off_point: TripStopDTO;
  booking_distance: number;
  seat_count: number;
  status: string;
  total_price: number;
}
