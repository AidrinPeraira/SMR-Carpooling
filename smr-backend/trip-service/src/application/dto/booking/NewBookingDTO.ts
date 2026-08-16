import { TripStop } from "@sharemyride/shared";

export interface NewBookingRequestDTO {
  passengerId: string;
  tripId: string;
  pickupPoint: TripStop;
  dropOffPoint: TripStop;
  pickupPlaceId: string;
  dropOffPlaceId: string;
  seatCount: number;
  distanceKm: number;
}
