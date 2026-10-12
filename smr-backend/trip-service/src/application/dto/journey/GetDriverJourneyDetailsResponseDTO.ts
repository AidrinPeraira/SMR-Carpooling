import {
  JourneyStatus,
  PassengerJourneyStatus,
  TripStop,
} from "@sharemyride/shared";
import { JourneyStopDTO } from "./JourneyStopDTO";

export interface GetDriverJourneyDetailsResponseDTO {
  journeyId: string;
  journeyStatus: JourneyStatus;
  origin: TripStop;
  destination: TripStop;
  intermediateStops: JourneyStopDTO[];
  passengers: DriverJourneyPassengerDTO[];
}

export interface DriverJourneyPassengerDTO {
  passengerId: string;
  passengerName: string;
  passengerStatus: PassengerJourneyStatus;
  pickupLocation: TripStop;
  dropOffLocation: TripStop;
  pickupVerified: boolean;
}
