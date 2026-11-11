import { Route, TripStatus, TripStop } from "@sharemyride/shared";

export interface TripEntity {
  tripId: string;
  driverId: string;
  vehicleId: string;
  tripOrigin: TripStop;
  tripDestination: TripStop;
  tripStops: TripStop[];
  tripRoute: Route;
  tripDistance: number;
  availableSeats: number;
  vacantSeats: number;
  tripTags: string[];
  startTime: Date;
  totalSeats: number;
  tripStatus: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}
