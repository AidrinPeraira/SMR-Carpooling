import { PassengerTodayTripResponseDTO } from "#/application/dto/trip/PassengerTripDTO";

export interface IGetPassengerTodayTripUseCase {
  execute(passengerId: string): Promise<PassengerTodayTripResponseDTO | null>;
}
