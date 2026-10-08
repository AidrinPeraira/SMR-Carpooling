import { JourneyStatus, PassengerJourneyStatus, StopType } from "../enums";
import { TripStopDTO } from "./TripDTO";

export interface JourneyStopResult {
  stop_lat: number;
  stop_lng: number;
  stop_name: string;
  stop_address: string;
  stop_type: StopType;
  passenger_id: string;
}

export interface DriverJourneyPassengerResult {
  passenger_id: string;
  passenger_name: string;
  passenger_status: PassengerJourneyStatus;
  pickup_location: TripStopDTO;
  drop_off_location: TripStopDTO;
}

export interface GetDriverJourneyDetailsResult {
  journey_id: string;
  journey_status: JourneyStatus;
  origin: TripStopDTO;
  destination: TripStopDTO;
  intermediate_stops: JourneyStopResult[];
  passengers: DriverJourneyPassengerResult[];
}

export interface PassengerOwnDetailsResult {
  passenger_status: PassengerJourneyStatus;
  pickup_location: TripStopDTO;
  drop_off_location: TripStopDTO;
  pickup_otp: string | null;
}

export interface PassengerPeerResult {
  passenger_name: string;
  pickup_location: TripStopDTO;
  drop_off_location: TripStopDTO;
}

export interface GetPassengerJourneyDetailsResult {
  journey_id: string;
  journey_status: JourneyStatus;
  origin: TripStopDTO;
  destination: TripStopDTO;
  intermediate_stops: JourneyStopResult[];
  my_details: PassengerOwnDetailsResult;
  other_passengers: PassengerPeerResult[];
}
