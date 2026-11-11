import { BookingStatus, TripStop } from "@sharemyride/shared";

export interface BookingEntity {
  bookingId: string;
  passengerId: string;
  tripId: string;
  pickupPoint: TripStop;
  dropOffPoint: TripStop;
  distanceKm: number;
  seatCount: number;
  pickupPlaceId: string;
  dropOffPlaceId: string;
  status: BookingStatus;
  paymentKey?: string;
  paymentKeyExpiry?: Date;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
