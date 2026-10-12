export interface CreateJourneyRequestDTO {
  journeyId: string;
  driverId: string;
  membersIDs: string[];
}

export interface DriverJoinJourneyRequestDTO {
  journeyId: string;
  driverId: string;
}

export interface PassengerJoinJourneyRequestDTO {
  journeyId: string;
  userId: string;
}

export interface ShareTokenJoinJourneyRequestDTO {
  journeyId: string;
  shareToken: string;
}

export interface UpdateLocationRequestDTO {
  journeyId: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  timestamp: number;
}

export interface LeaveJourneyRequestDTO {
  journeyId: string;
}

export interface EndJourneyRequestDTO {
  journeyId: string;
}

export interface GetShareTokenRequestDTO {
  journeyId: string;
  userId: string;
}

export interface GetShareTokenResponseDTO {
  shareToken: string;
}

export interface RemovePassengerFromJourneyRequestDTO {
  journeyId: string;
  passengerId: string;
}
