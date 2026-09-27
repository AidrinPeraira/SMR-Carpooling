import { DriverStatus, VehicleTypes, VehicleStatus } from "../enums";
import { BookingStatus, TripStatus } from "../enums";
import { ApiResponse } from "../responses";

export interface GetDriverDetailsResult {
  driver_id: string;
  record_id: string;
  license_number: string;
  license_image: string;
  driver_status: DriverStatus;
  created_at: Date;
  updated_at: Date;
}

export type GetDriverDetailsResponseDTO =
  ApiResponse<GetDriverDetailsResult | null>;

export interface TodayTripResult {
  trip_id: string;
  origin: string;
  destination: string;
  start_time: Date;
  vacant_seats: number;
  total_seats: number;
  trip_status: TripStatus;
}

export interface RecentBookingResult {
  booking_id: string;
  passenger_name: string;
  pickup: string;
  drop_off: string;
  seat_count: number;
  status: BookingStatus;
  total_price: number;
  created_at: Date;
}

export interface DriverStatsResult {
  total_trips_completed: number;
  total_earnings: number;
  total_passengers: number;
}

export interface ActiveVehicleResult {
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  registration_number: string;
  vehicle_status: VehicleStatus;
}

export interface GetDriverOverviewResult {
  driver_status: DriverStatus;
  today_trip: TodayTripResult | null;
  recent_bookings: RecentBookingResult[];
  stats: DriverStatsResult;
  active_vehicle: ActiveVehicleResult | null;
}

export type GetDriverOverviewResponseDTO =
  ApiResponse<GetDriverOverviewResult>;
