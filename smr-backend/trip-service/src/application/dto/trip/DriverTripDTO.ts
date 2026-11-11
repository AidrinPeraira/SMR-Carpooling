import { TripStatus, TripStop } from "@sharemyride/shared";

export interface DriverTodayTripResponseDTO {
  tripId: string;
  startTime: string;
  confirmedSeats: number;
  totalSeats: number;
  estimatedEarnings: number;
  startLocation: TripStop;
  endLocation: TripStop;
  status: TripStatus;
}
