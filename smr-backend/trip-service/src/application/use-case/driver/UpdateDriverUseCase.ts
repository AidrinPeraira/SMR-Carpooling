import { UpdateDriverRequestDTO } from "#/application/dto/driver/UpdateDriverRequestDTO";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { IUpdateDriverUseCase } from "#/application/interfaces/use-case/driver/IUpdateDriverUseCase";

/**
 * This class imeplements the use case to update the driver
 * when a driver record is renewed.
 */
export class UpdateDriverUseCase implements IUpdateDriverUseCase {
  constructor(private readonly _driverRepository: IDriverRepository) {}

  /**
   * This method takes the data of updated driver record and updates driver details
   *
   * @param data : Updated driver record details
   */
  async execute(data: UpdateDriverRequestDTO): Promise<void> {
    const { driverId, ...updateData } = data;
    await this._driverRepository.update(driverId, {
      ...updateData,
      updatedAt: new Date(),
    });
  }
}
