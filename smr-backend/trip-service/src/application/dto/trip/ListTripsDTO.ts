import { QueryDTO, TripStop, VehicleTypes } from "@sharemyride/shared";

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
  seatsAvailable: number;
  time: Date;
  vehicleType: VehicleTypes;
}
