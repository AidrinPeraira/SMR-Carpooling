import { UnblockPassengerDTO } from "#/application/dto/passenger/UnblockPassengerDTO";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { IUnblockPassengerUseCase } from "#/application/interfaces/use-case/passenger/IUnblockPassengerUseCase";

/**
 * Implementation of the use case to unblock a passenger
 */
export class UnblockPassengerUseCase implements IUnblockPassengerUseCase {
  constructor(private readonly _passengerRepository: IPassengerRepository) {}

  async execute(data: UnblockPassengerDTO): Promise<void> {
    await this._passengerRepository.update(data.passengerId, {
      isActive: true,
    });
  }
}
