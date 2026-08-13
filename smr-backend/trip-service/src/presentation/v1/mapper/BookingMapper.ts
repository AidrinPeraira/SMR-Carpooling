import { NewBookingRequestDTO } from "#/application/dto/trip/BookingDTO";
import { TripMapper } from "#/presentation/v1/mapper/TripMapper";
import { CreateBookingSchemaType } from "@sharemyride/shared";

export class BookingMapper {
  static toNewBookingRequestDTO(
    passengerId: string,
    body: CreateBookingSchemaType,
  ): NewBookingRequestDTO {
    return {
      passengerId,
      tripId: body.trip_id,
      pickupPoint: TripMapper.toTripStop(body.pickup_point),
      dropOffPoint: TripMapper.toTripStop(body.drop_off_point),
      pickupPlaceId: body.pickup_place_id,
      dropOffPlaceId: body.drop_off_place_id,
      seatCount: body.seat_count,
      distanceKm: body.distance_km,
    };
  }
}
