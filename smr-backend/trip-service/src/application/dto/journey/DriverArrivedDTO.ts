import { StopType } from "@sharemyride/shared";

export interface DriverArrivedRequestDTO {
  journeyId: string;
  passengerId: string;
  stopType: StopType;
  arrivedLat: number;
  arrivedLng: number;
  arrivedTime: Date;
}
