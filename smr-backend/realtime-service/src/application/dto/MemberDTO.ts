export interface CreateNewMemberRequestDTO {
  firstName: string;
  lastName: string;
  userId: string;
}

export interface AddActiveTripRequestDTO {
  userId: string;
  tripId: string;
}

export type RemoveActiveTripRequestDTO = AddActiveTripRequestDTO;
