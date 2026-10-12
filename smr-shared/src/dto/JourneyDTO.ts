import { JourneyStatus, PassengerJourneyStatus, StopType } from "../enums";
import { TripStopDTO } from "./TripDTO";

export interface JourneyStopResult {
  stop_lat: number;
  stop_lng: number;
  stop_name: string;
  stop_address: string;
  stop_type: StopType;
  passenger_id: string;
  passenger_name: string;
  arrived_at: string | null;
}

export interface DriverJourneyPassengerResult {
  passenger_id: string;
  passenger_name: string;
  passenger_status: PassengerJourneyStatus;
  pickup_location: TripStopDTO;
  drop_off_location: TripStopDTO;
  pickup_verified: boolean;
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

export interface DriverJoinJourneyDTO {
  journey_id: string;
}

export interface PassengerJoinJourneyDTO {
  journey_id: string;
}

export interface ShareTokenJoinJourneyDTO {
  journey_id: string;
  share_token: string;
}

export interface UpdateLocationDTO {
  journey_id: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  timestamp: number;
}

export interface LocationBroadcastDTO {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  timestamp: number;
}

export interface LeaveJourneyDTO {
  journey_id: string;
}

export interface GetShareTokenRequest {
  journey_id: string;
}

export interface GetShareTokenResponse {
  share_token: string;
}

export interface DriverArrivedRequest {
  journey_id: string;
  passenger_id: string;
  stop_type: string;
  arrived_lat: number;
  arrived_lng: number;
}

export interface DriverVerifyPickupRequest {
  journey_id: string;
  passenger_id: string;
  pickup_otp: string;
}

export interface PassengerConfirmPickupRequest {
  journey_id: string;
}

export interface DriverDropOffPassengerRequest {
  journey_id: string;
  passenger_id: string;
  drop_off_lat: number;
  drop_off_lng: number;
}

export interface PassengerConfirmDropOffRequest {
  journey_id: string;
  drop_off_lat: number;
  drop_off_lng: number;
}

export interface PassengerNoShowRequest {
  journey_id: string;
  passenger_id: string;
}
