export interface JourneyEntity {
  journeyId: string;
  driverId: string;
  members: JourneyMember[];
  isActive: boolean;
}

export interface JourneyMember {
  memberId: string;
  shareToken?: string;
}
