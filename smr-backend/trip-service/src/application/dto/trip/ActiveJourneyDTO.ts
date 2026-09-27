import {
  JourneyStop,
  PassengerRideStatus,
  StopType,
  TripStatus,
  TripStop,
} from "@sharemyride/shared";

export interface ActiveJourneyPassengerDetails {
  journeyPassengerId: string;
  passengerId: string;
  passengerName: string;
  bookingId: string;
  passengerStatus: PassengerRideStatus;
  pickupLocation: TripStop;
  dropOffLocation: TripStop;
  pickupTime: Date | null;
  dropoffTime: Date | null;
  pickupVerified: boolean;
}

export interface DriverGetActiveJourneyResponseDTO {
  //journey details
  journeyId: string;
  origin: TripStop;
  destination: TripStop;
  intermediateStops: JourneyStop[]; //passenger pickup and drop off stops in order
  journeyStatus: TripStatus.ONGOING | TripStatus.COMPLETED;
  startedAt: Date;

  //journey passenger details
  passengers: ActiveJourneyPassengerDetails[];
}

export interface DriverArrivedAtStopRequestDTO {
  journeyId: string;
  driverId: string;
  passengerId: string;
  driverLng: number;
  driverLat: number;
  stopType: StopType;
}
