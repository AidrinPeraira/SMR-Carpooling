import { QueryDTO, Route, TripStop, VehicleTypes } from "@sharemyride/shared";

export interface ListTripsRequestDTO {
  origin: TripStop;
  destination: TripStop;
  time: Date;
  query?: QueryDTO<ListTripsResultDTO>;
}

export interface ListTripsResultDTO {
  tripId: string;
  tripOrigin: TripStop;
  tripDestination: TripStop;
  tripDistance: number;
  driverName: string;
  seatsAvailable: number;
  time: Date;
  vehicleType: VehicleTypes;
}

export interface GetJourneyDetailsResponseDTO {
  tripId: string;
  tripStops: TripStop[];
  tripRoute: Route[];
  availableStops: Route[];
  basePrice: number;
  pricePerKm: number;
}

