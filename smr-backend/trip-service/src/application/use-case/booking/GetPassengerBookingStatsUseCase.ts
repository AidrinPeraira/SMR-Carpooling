import { PassengerBookingStatsResponseDTO } from "#/application/dto/booking/PassengerStatsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IGetPassengerBookingStatsUseCase } from "#/application/interfaces/use-case/booking/IGetPassengerBookingStatsUseCase";

export class GetPassengerBookingStatsUseCase
  implements IGetPassengerBookingStatsUseCase
{
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  async execute(
    passengerId: string,
  ): Promise<PassengerBookingStatsResponseDTO> {
    return this._bookingRepository.getPassengerBookingStats(passengerId);
  }
}
