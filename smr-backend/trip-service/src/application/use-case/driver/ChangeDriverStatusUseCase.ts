import { ChangeDriverStatusDTO } from "#/application/dto/driver/ChangeDriverStatusDTO";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { IChangeDriverStatusUseCase } from "#/application/interfaces/use-case/driver/IChangeDriverStatusUseCase";

export class ChangeDriverStatusUseCase implements IChangeDriverStatusUseCase {
  constructor(private readonly _driverRepository: IDriverRepository) {}

  async execute(data: ChangeDriverStatusDTO): Promise<void> {
    await this._driverRepository.update(data.driverId, {
      driverStatus: data.driverStatus,
      updatedAt: new Date(),
    });
  }
}
