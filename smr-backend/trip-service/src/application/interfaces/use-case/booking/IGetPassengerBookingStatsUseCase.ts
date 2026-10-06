import { PassengerBookingStatsResponseDTO } from "#/application/dto/booking/PassengerHomeDTO";

export interface IGetPassengerBookingStatsUseCase {
  execute(passengerId: string): Promise<PassengerBookingStatsResponseDTO>;
}
