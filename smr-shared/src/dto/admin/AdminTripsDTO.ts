import { BookingStatus, TripStatus } from "../../enums";
import { Route } from "../../types";
import { TripStopDTO } from "../TripDTO";

export interface AdminTripItemDTO {
  trip_id: string;
  driver_name: string;
  vehicle_name: string;
  trip_origin: string;
  trip_destination: string;
  available_seats: number;
  vacant_seats: number;
  start_time: string | Date;
  trip_status: TripStatus;
}

export interface AdminBookingItemForTripDetailsDTO {
  booking_id: string;
  passenger_name: string;
  booking_status: BookingStatus;
  booking_origin: string;
  booking_destination: string;
}

export interface AdminTripDetailsDTO {
  trip_id: string;
  trip_origin: TripStopDTO;
  trip_destination: TripStopDTO;
  route: Route;
  trip_date: string | Date;

  vehicle_id: string;
  vehicle_name: string;
  vehicle_image: string;

  driver_id: string;
  driver_name: string;

  bookings: AdminBookingItemForTripDetailsDTO[];
}
