import { GetDriverJourneyDetailsResponseDTO } from "#/application/dto/journey/GetDriverJourneyDetailsResponseDTO";
import { GetPassengerJourneyDetailsResponseDTO } from "#/application/dto/journey/GetPassengerJourneyDetailsDTO";
import { TripMapper } from "./TripMapper";
import {
  GetDriverJourneyDetailsResult,
  GetPassengerJourneyDetailsResult,
} from "@sharemyride/shared";

export class JourneyMapper {
  static toGetDriverJourneyDetailsResult(
    dto: GetDriverJourneyDetailsResponseDTO,
  ): GetDriverJourneyDetailsResult {
    return {
      journey_id: dto.journeyId,
      journey_status: dto.journeyStatus,
      origin: TripMapper.toTripStopDTO(dto.origin),
      destination: TripMapper.toTripStopDTO(dto.destination),
      intermediate_stops: dto.intermediateStops.map((stop) => ({
        stop_lat: stop.stopLat,
        stop_lng: stop.stopLng,
        stop_name: stop.stopName,
        stop_address: stop.stopAddress,
        stop_type: stop.stopType,
        passenger_id: stop.passengerId,
        passenger_name: stop.passengerName,
      })),
      passengers: dto.passengers.map((p) => ({
        passenger_id: p.passengerId,
        passenger_name: p.passengerName,
        passenger_status: p.passengerStatus,
        pickup_location: TripMapper.toTripStopDTO(p.pickupLocation),
        drop_off_location: TripMapper.toTripStopDTO(p.dropOffLocation),
      })),
    };
  }

  static toGetPassengerJourneyDetailsResult(
    dto: GetPassengerJourneyDetailsResponseDTO,
  ): GetPassengerJourneyDetailsResult {
    return {
      journey_id: dto.journeyId,
      journey_status: dto.journeyStatus,
      origin: TripMapper.toTripStopDTO(dto.origin),
      destination: TripMapper.toTripStopDTO(dto.destination),
      intermediate_stops: dto.intermediateStops.map((stop) => ({
        stop_lat: stop.stopLat,
        stop_lng: stop.stopLng,
        stop_name: stop.stopName,
        stop_address: stop.stopAddress,
        stop_type: stop.stopType,
        passenger_id: stop.passengerId,
        passenger_name: stop.passengerName,
      })),
      my_details: {
        passenger_status: dto.myDetails.passengerStatus,
        pickup_location: TripMapper.toTripStopDTO(dto.myDetails.pickupLocation),
        drop_off_location: TripMapper.toTripStopDTO(dto.myDetails.dropOffLocation),
        pickup_otp: dto.myDetails.pickupOTP,
      },
      other_passengers: dto.otherPassengers.map((p) => ({
        passenger_name: p.passengerName,
        pickup_location: TripMapper.toTripStopDTO(p.pickupLocation),
        drop_off_location: TripMapper.toTripStopDTO(p.dropOffLocation),
      })),
    };
  }
}
