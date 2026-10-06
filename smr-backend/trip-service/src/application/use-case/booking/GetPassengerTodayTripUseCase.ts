import { PassengerTodayTripResponseDTO } from "#/application/dto/booking/PassengerHomeDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IGetPassengerTodayTripUseCase } from "#/application/interfaces/use-case/booking/IGetPassengerTodayTripUseCase";

export class GetPassengerTodayTripUseCase
  implements IGetPassengerTodayTripUseCase
{
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  async execute(
    passengerId: string,
  ): Promise<PassengerTodayTripResponseDTO | null> {
    return this._bookingRepository.findPassengerTodayTrip(passengerId);
  }
}
