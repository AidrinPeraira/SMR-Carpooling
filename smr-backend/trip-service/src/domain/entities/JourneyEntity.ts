import { TripStatus, TripStop, JourneyStop } from "@sharemyride/shared";

// This is is the entity used to track the actual trip
export interface JourneyEntity {
  journeyId: string; //matches the trip id
  driverId: string;
  origin: TripStop;
  destination: TripStop;
  intermediateStops: JourneyStop[]; //passenger pickup and drop of stops in order
  journeyStatus: TripStatus.ONGOING | TripStatus.COMPLETED;
  createdAt: Date;
  updatedAt: Date;
}
