import { JourneyStatus, StopType, TripStop } from "@sharemyride/shared";

export interface JourneyEntity {
  journeyId: string; //matches the trip id
  driverId: string;
  origin: TripStop;
  destination: TripStop;
  intermediateStops: JourneyStop[]; //passenger pickup and drop of stops in order
  journeyStatus: JourneyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface JourneyStop {
  stopLat: number;
  stopLng: number;
  stopName: string;
  stopAddress: string;
  arrivedAt: Date | null;
  departedAt: Date | null;
  passengerId: string;
  stopType: StopType;

  //where the driver actually was when they marked the stop arrived,
  //kept apart from the planned stop so the two can be compared later
  arrivedLat: number | null;
  arrivedLng: number | null;
}
