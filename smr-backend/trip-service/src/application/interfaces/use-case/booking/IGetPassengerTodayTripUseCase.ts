import { PassengerTodayTripResponseDTO } from "#/application/dto/booking/PassengerHomeDTO";

export interface IGetPassengerTodayTripUseCase {
  execute(passengerId: string): Promise<PassengerTodayTripResponseDTO | null>;
}
