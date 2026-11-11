import { BlockPassengerDTO } from "#/application/dto/passenger/BlockPassengerDTO";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { IBlockPassengerUseCase } from "#/application/interfaces/use-case/passenger/IBlockPassengerUseCase";

/**
 * Implementation of the use case to block a passenger
 */
export class BlockPassengerUseCase implements IBlockPassengerUseCase {
  constructor(private readonly _passengerRepository: IPassengerRepository) {}

  async execute(data: BlockPassengerDTO): Promise<void> {
    await this._passengerRepository.update(data.passengerId, {
      isActive: false,
    });
  }
}
