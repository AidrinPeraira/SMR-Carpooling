import {
  BookingStatus,
  QueryDTO,
  Route,
  TrendRange,
  TripStatus,
  TripStop,
} from "@sharemyride/shared";

export type AdminGetAllTripsQuery = QueryDTO<AdminGetAllTripsResponseDTO>;

export interface AdminGetAllTripsResponseDTO {
  tripId: string;
  driverName: string;
  vehicleName: string;
  tripOrigin: string;
  tripDestination: string;
  availableSeats: number;
  vacantSeats: number;
  startTime: Date;
  tripStatus: TripStatus;
}

type BookingDetails = {
  bookingId: string;
  passengerName: string;
  bookingStatus: BookingStatus;
  bookingOrigin: string;
  bookingDestination: string;
};

export interface AdminGetTripDetailsResponseDTO {
  tripId: string;
  tripOrigin: TripStop;
  tripDestination: TripStop;
  route: Route;
  tripDate: Date;

  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;

  driverId: string;
  driverName: string;

  bookings: BookingDetails[];
}

export interface GetTripsCountResposneDTO {
  totalTrips: number;
  completedTrips: number;
  upcomingTrips: number;
  cancelledTrips: number;
}

export interface GetTripTrendResponseDTO {
  trendRange: TrendRange;
  data: {
    label: string;
    value: number;
  }[];
}
