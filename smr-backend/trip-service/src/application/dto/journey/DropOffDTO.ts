export interface DropOffRequestDTO {
  journeyId: string;
  passengerId: string;
  dropOffLat: number;
  dropOffLng: number;
  dropOffTime: Date;
}
