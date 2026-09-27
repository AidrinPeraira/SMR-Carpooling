import {
  BookingStatus,
  DriverStatus,
  TripStatus,
  VehicleStatus,
  VehicleTypes,
} from "@sharemyride/shared";

export interface DriverOverviewResponseDTO {
  driverStatus: DriverStatus;
  todayTrip: TodayTripDTO | null;
  recentBookings: RecentBookingDTO[];
  stats: DriverStatsDTO;
  activeVehicle: ActiveVehicleDTO | null;
}

export interface TodayTripDTO {
  tripId: string;
  origin: string;
  destination: string;
  startTime: Date;
  vacantSeats: number;
  totalSeats: number;
  tripStatus: TripStatus;
}

export interface RecentBookingDTO {
  bookingId: string;
  passengerName: string;
  pickup: string;
  dropOff: string;
  seatCount: number;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
}

export interface DriverStatsDTO {
  totalTripsCompleted: number;
  totalEarnings: number;
  totalPassengers: number;
}

export interface ActiveVehicleDTO {
  vehicleType: VehicleTypes;
  vehicleMake: string;
  vehicleModel: string;
  registrationNumber: string;
  vehicleStatus: VehicleStatus;
}
