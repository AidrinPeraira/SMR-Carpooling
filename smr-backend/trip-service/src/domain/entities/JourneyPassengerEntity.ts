import { PassengerRideStatus, TripStop } from "@sharemyride/shared";

export interface JourneyPassengerEntity {
  journeyPassengerId: string;
  passengerId: string;
  passengerName: string;
  journeyId: string;
  bookingId: string;
  passengerStatus: PassengerRideStatus;
  pickupLocation: TripStop;
  dropOffLocation: TripStop;
  pickupOTP: string | null;
  pickupTime: Date | null;
  dropoffTime: Date | null;
  pickupVerified: boolean;
}
