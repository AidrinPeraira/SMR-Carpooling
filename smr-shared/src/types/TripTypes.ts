import { StopType } from "../enums";

export type Route = [number, number][];

export interface TripStop {
  stopLat: number;
  stopLng: number;
  stopName: string;
  stopAddress: string;
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
  arrivedLat?: number | null;
  arrivedLng?: number | null;
}
