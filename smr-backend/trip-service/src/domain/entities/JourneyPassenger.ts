import { PassengerJourneyStatus, TripStop } from "@sharemyride/shared";

export interface JourneyPassengerEntity {
  passengerId: string;
  passengerName: string;
  journeyId: string;
  bookingId: string;
  passengerStatus: PassengerJourneyStatus;
  pickupLocation: TripStop;
  dropOffLocation: TripStop;
  pickupOTP: string | null;
  pickupTime: Date | null;
  dropoffTime: Date | null;
  pickupVerified: boolean;
}
