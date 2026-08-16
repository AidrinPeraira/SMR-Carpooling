import {
  BookingStatus,
  Route,
  TripStatus,
  TripStop,
} from "@sharemyride/shared";

export interface DriverGetAllTripsQueryDTO {
  tripStatus?: TripStatus;
  page?: number;
  limit?: number;
}

export interface DriverListTripsResponseDTO {
  tripId: string;
  tripOrigin: string;
  tripDestination: string;
  vehicleMake: string;
  vehicleModel: string;
  availableSeats: number;
  vacantSeats: number;
  startTime: Date;
  tripStatus: TripStatus;
}

export interface BookingDetails {
  bookingId: string;
  passengerName: string;
  bookingStatus: BookingStatus;
  seatCount: number;
}

export interface DriverGetTripDetailsResponseDTO {
  tripDate: Date;
  tripVehicle: string;
  tirpVehicleImage: string;
  tripRoute: Route[];

  tripOrigin: TripStop;
  tripDestination: TripStop;
  tripStops: TripStop[];

  startTime: Date;
  tripStatus: TripStatus;

  tripBookings: BookingDetails[];
}
