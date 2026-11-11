import { PassengerTodayTripResponseDTO } from "#/application/dto/trip/PassengerTripDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IGetPassengerTodayTripUseCase } from "#/application/interfaces/use-case/trip/IGetPassengerTodayTripUseCase";

export class GetPassengerTodayTripUseCase implements IGetPassengerTodayTripUseCase {
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  async execute(
    passengerId: string,
  ): Promise<PassengerTodayTripResponseDTO | null> {
    return this._bookingRepository.findPassengerTodayTrip(passengerId);
  }
}
