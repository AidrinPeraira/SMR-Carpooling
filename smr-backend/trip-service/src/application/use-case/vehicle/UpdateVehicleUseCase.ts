import { UpdateVehicleRequestDTO } from "#/application/dto/vehicle/UpdateVehicleRequestDTO";
import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import { IUpdateVehicleUseCase } from "#/application/interfaces/use-case/vehicle/IUpdateVehicleUseCase";

/**
 * This is the implementation for the use case that handles
 * updating existing vehicle with details from new approved record
 */
export class UpdateVehicleUseCase implements IUpdateVehicleUseCase {
  constructor(private readonly _vehicleRepository: IVehicleRepository) {}

  /**
   * This method updates the vehicle data with the details from the
   * new approved record.
   *
   * @param data : Updated vehicle record data
   */
  async execute(data: UpdateVehicleRequestDTO): Promise<void> {
    const { registrationNumber, ...updateData } = data;
    await this._vehicleRepository.updateByRegistrationNumber(
      registrationNumber,
      {
        ...updateData,
        updatedAt: new Date(),
      },
    );
  }
}
