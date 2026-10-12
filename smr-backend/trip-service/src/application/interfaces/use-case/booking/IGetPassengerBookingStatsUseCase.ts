import { PassengerBookingStatsResponseDTO } from "#/application/dto/booking/PassengerStatsDTO";

export interface IGetPassengerBookingStatsUseCase {
  execute(passengerId: string): Promise<PassengerBookingStatsResponseDTO>;
}
