import { StopType } from "@sharemyride/shared";

export interface JourneyStopDTO {
  stopLat: number;
  stopLng: number;
  stopName: string;
  stopAddress: string;
  stopType: StopType;
  passengerId: string;
}
