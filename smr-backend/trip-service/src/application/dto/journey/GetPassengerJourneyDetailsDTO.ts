import {
  JourneyStatus,
  PassengerJourneyStatus,
  TripStop,
} from "@sharemyride/shared";
import { JourneyStopDTO } from "./JourneyStopDTO";

export interface GetPassengerJourneyDetailsResponseDTO {
  journeyId: string;
  driverId: string;
  journeyStatus: JourneyStatus;
  origin: TripStop;
  destination: TripStop;
  intermediateStops: JourneyStopDTO[];
  myDetails: PassengerOwnDetailsDTO;
  otherPassengers: PassengerPeerDTO[];
}

export interface PassengerOwnDetailsDTO {
  passengerStatus: PassengerJourneyStatus;
  pickupLocation: TripStop;
  dropOffLocation: TripStop;
  pickupOTP: string | null;
}

export interface PassengerPeerDTO {
  passengerName: string;
  pickupLocation: TripStop;
  dropOffLocation: TripStop;
}
