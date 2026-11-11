import { JourneyStopDTO } from "#/application/dto/journey/JourneyStopDTO";
import { JourneyStatus, PassengerJourneyStatus, TripStop } from "@sharemyride/shared";

/**
 * Retrieves the full journey details including all passengers
 * for admin review. The journeyId always matches the tripId.
 */
export interface IAdminGetJourneyDetailsUseCase {
  execute(journeyId: string): Promise<AdminGetJourneyDetailsResponseDTO>;
}

export interface AdminJourneyPassengerDTO {
  passengerId: string;
  passengerName: string;
  bookingId: string;
  passengerStatus: PassengerJourneyStatus;
  pickupLocation: TripStop;
  dropOffLocation: TripStop;
  pickupVerified: boolean;
  pickupTime: Date | null;
  dropoffTime: Date | null;
}

export interface AdminGetJourneyDetailsResponseDTO {
  journeyId: string;
  driverId: string;
  journeyStatus: JourneyStatus;
  origin: TripStop;
  destination: TripStop;
  intermediateStops: JourneyStopDTO[];
  passengers: AdminJourneyPassengerDTO[];
  createdAt: Date;
  updatedAt: Date;
}
