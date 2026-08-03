import { AddDriverRequestDTO } from "#/application/dto/driver/AddDriverRequestDTO";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { IAddDriverUseCase } from "#/application/interfaces/use-case/driver/IAddDriverUseCase";
import { DriverEntity } from "#/domain/entities/DriverEntity";

/**
 * This is the implementation for add driver use case. It creates a new driver
 * using the data from application approval events
 */
export class AddDriverUseCase implements IAddDriverUseCase {
  constructor(private readonly _driverRepository: IDriverRepository) {}

  /**
   * This method takes driver data and creates a new driver entity
   * based on the driver records data
   *
   * @param data : Driver details based on approved driver data
   */
  async execute(data: AddDriverRequestDTO): Promise<void> {
    const now = new Date();

    const driverEntity: DriverEntity = {
      driverId: data.driverId,
      recordId: data.recordId,
      licenseNumber: data.licenseNumber,
      licenseImage: data.licenseImage,
      driverStatus: data.driverStatus,
      createdAt: now,
      updatedAt: now,
    };

    await this._driverRepository.save(driverEntity);
  }
}
