import { DriverArrivedRequestDTO } from "#/application/dto/journey/DriverArrivedDTO";
import { DriverVerifyPickupRequestDTO } from "#/application/dto/journey/DriverVerifyPickupDTO";
import { DropOffRequestDTO } from "#/application/dto/journey/DropOffDTO";
import { GetDriverJourneyDetailsResponseDTO } from "#/application/dto/journey/GetDriverJourneyDetailsResponseDTO";
import { GetPassengerJourneyDetailsResponseDTO } from "#/application/dto/journey/GetPassengerJourneyDetailsDTO";
import { PassengerConfirmPickupRequestDTO } from "#/application/dto/journey/PassengerConfirmPickupDTO";
import { PassengerNoShowRequestDTO } from "#/application/dto/journey/PassengerNoShowDTO";
import { TripMapper } from "./TripMapper";
import {
  DriverArrivedRequest,
  DriverDropOffPassengerRequest,
  DriverVerifyPickupRequest,
  GetDriverJourneyDetailsResult,
  GetPassengerJourneyDetailsResult,
  PassengerConfirmDropOffRequest,
  PassengerConfirmPickupRequest,
  PassengerNoShowRequest,
  StopType,
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
        arrived_at: stop.arrivedAt?.toISOString() ?? null,
      })),
      passengers: dto.passengers.map((p) => ({
        passenger_id: p.passengerId,
        passenger_name: p.passengerName,
        passenger_status: p.passengerStatus,
        pickup_location: TripMapper.toTripStopDTO(p.pickupLocation),
        drop_off_location: TripMapper.toTripStopDTO(p.dropOffLocation),
        pickup_verified: p.pickupVerified,
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
        arrived_at: stop.arrivedAt?.toISOString() ?? null,
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

  static toDriverArrivedDTO(
    body: DriverArrivedRequest,
  ): DriverArrivedRequestDTO {
    return {
      journeyId: body.journey_id,
      passengerId: body.passenger_id,
      stopType: body.stop_type as StopType,
      arrivedLat: body.arrived_lat,
      arrivedLng: body.arrived_lng,
      arrivedTime: new Date(),
    };
  }

  static toDriverVerifyPickupDTO(
    body: DriverVerifyPickupRequest,
  ): DriverVerifyPickupRequestDTO {
    return {
      journeyId: body.journey_id,
      passengerId: body.passenger_id,
      pickupOtp: body.pickup_otp,
    };
  }

  static toPassengerConfirmPickupDTO(
    body: PassengerConfirmPickupRequest,
  ): PassengerConfirmPickupRequestDTO {
    return {
      journeyId: body.journey_id,
      pickupTime: new Date().toISOString(),
    };
  }

  static toDriverDropOffDTO(
    body: DriverDropOffPassengerRequest,
  ): DropOffRequestDTO {
    return {
      journeyId: body.journey_id,
      passengerId: body.passenger_id,
      dropOffLat: body.drop_off_lat,
      dropOffLng: body.drop_off_lng,
      dropOffTime: new Date(),
    };
  }

  static toPassengerConfirmDropOffDTO(
    body: PassengerConfirmDropOffRequest,
    passengerId: string,
  ): DropOffRequestDTO {
    return {
      journeyId: body.journey_id,
      passengerId,
      dropOffLat: body.drop_off_lat,
      dropOffLng: body.drop_off_lng,
      dropOffTime: new Date(),
    };
  }

  static toPassengerNoShowDTO(
    body: PassengerNoShowRequest,
  ): PassengerNoShowRequestDTO {
    return {
      journeyId: body.journey_id,
      passengerId: body.passenger_id,
      currentTime: new Date().toISOString(),
    };
  }
}
