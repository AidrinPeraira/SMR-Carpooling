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
}
