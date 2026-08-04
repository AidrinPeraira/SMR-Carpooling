import { DriverDetailsDTO } from "#/application/dto/driver/DriverDetailsDTO";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { IGetDriverDetailsUseCase } from "#/application/interfaces/use-case/driver/IGetDriverDetailsUseCase";

export class GetDriverDetailsUseCase implements IGetDriverDetailsUseCase {
  constructor(private readonly _driverRepository: IDriverRepository) {}

  async execute(driverId: string): Promise<DriverDetailsDTO | null> {
    const driver = await this._driverRepository.findByDriverId(driverId);
    if (!driver) return null;

    return {
      driverId: driver.driverId,
      recordId: driver.recordId,
      licenseNumber: driver.licenseNumber,
      licenseImage: driver.licenseImage,
      driverStatus: driver.driverStatus,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    };
  }
}
