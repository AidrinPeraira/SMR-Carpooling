import { CreateNewPassengerRequestDTO } from "#/application/dto/passenger/CreateNewPassengerRequestDTO";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { ICreateNewPassengerUseCase } from "#/application/interfaces/use-case/passenger/ICreateNewPassengerUseCase";
import { PassengerEntity } from "#/domain/entities/PassengerEntity";

/**
 * This class implements the use case that creates a new
 * passenger record in the passenger repository.
 */
export class CreateNewPassengerUseCase implements ICreateNewPassengerUseCase {
  constructor(private readonly _passengerRepository: IPassengerRepository) {}

  async execute(data: CreateNewPassengerRequestDTO): Promise<void> {
    const now = new Date();

    const newPassenger: PassengerEntity = {
      passengerId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await this._passengerRepository.save(newPassenger);
  }
}
