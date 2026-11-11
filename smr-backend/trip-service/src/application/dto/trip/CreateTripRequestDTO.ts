import { Route, TripStop } from "@sharemyride/shared";

export interface CreateTripRequestDTO {
  driverId: string;
  vehicleId: string;
  tripOrigin: TripStop;
  tripDestination: TripStop;
  tripStops: TripStop[];
  tripRoute: Route;
  tripDistance: number;
  availableSeats: number;
  tripTags: string[];
  startTime: Date;
  totalSeats: number;
}
