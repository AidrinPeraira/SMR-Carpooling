import {
  DriverJoinJourneyRequestDTO,
  LeaveJourneyRequestDTO,
  PassengerJoinJourneyRequestDTO,
  ShareTokenJoinJourneyRequestDTO,
  UpdateLocationRequestDTO,
  GetShareTokenRequestDTO,
  GetShareTokenResponseDTO,
} from "#/application/dto/JourneyDTO";
import {
  DriverJoinJourneyDTO,
  PassengerJoinJourneyDTO,
  ShareTokenJoinJourneyDTO,
  UpdateLocationDTO,
  LeaveJourneyDTO,
  GetShareTokenRequest,
  GetShareTokenResponse,
} from "@sharemyride/shared";

export class JourneySocketMapper {
  static toDriverJoinJourneyRequestDTO(
    payload: DriverJoinJourneyDTO,
    driverId: string,
  ): DriverJoinJourneyRequestDTO {
    return {
      journeyId: payload.journey_id,
      driverId,
    };
  }

  static toPassengerJoinJourneyRequestDTO(
    payload: PassengerJoinJourneyDTO,
    userId: string,
  ): PassengerJoinJourneyRequestDTO {
    return {
      journeyId: payload.journey_id,
      userId,
    };
  }

  static toShareTokenJoinJourneyRequestDTO(
    payload: ShareTokenJoinJourneyDTO,
  ): ShareTokenJoinJourneyRequestDTO {
    return {
      journeyId: payload.journey_id,
      shareToken: payload.share_token,
    };
  }

  static toUpdateLocationRequestDTO(
    payload: UpdateLocationDTO,
  ): UpdateLocationRequestDTO {
    return {
      journeyId: payload.journey_id,
      lat: payload.lat,
      lng: payload.lng,
      heading: payload.heading,
      speed: payload.speed,
      timestamp: payload.timestamp,
    };
  }

  static toLeaveJourneyRequestDTO(
    payload: LeaveJourneyDTO,
  ): LeaveJourneyRequestDTO {
    return {
      journeyId: payload.journey_id,
    };
  }

  static toGetShareTokenRequestDTO(
    payload: GetShareTokenRequest,
    userId: string,
  ): GetShareTokenRequestDTO {
    return {
      journeyId: payload.journey_id,
      userId,
    };
  }

  static toGetShareTokenResponse(
    dto: GetShareTokenResponseDTO,
  ): GetShareTokenResponse {
    return {
      share_token: dto.shareToken,
    };
  }
}
