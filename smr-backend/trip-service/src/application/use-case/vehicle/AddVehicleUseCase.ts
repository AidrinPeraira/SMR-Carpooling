import { AddVehicleRequestDTO } from "#/application/dto/vehicle/AddVehicleRequestDTO";
import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import { IAddVehicleUseCase } from "#/application/interfaces/use-case/vehicle/IAddVehicleUseCase";
import { VehicleEntity } from "#/domain/entities/VehicleEntity";
import { VehicleStatus } from "@sharemyride/shared";

/**
 * This is the implementation for the use case that handles
 * creating new vehicle for user based on the approved application
 * events
 */
export class AddVehicleUseCase implements IAddVehicleUseCase {
  constructor(private readonly _vehicleRepository: IVehicleRepository) {}

  /**
   * This method takes new vehicle data from vehicle records and creates
   * a new vehicle entry
   *
   * @param data : New vehicle data from record
   */
  async execute(data: AddVehicleRequestDTO): Promise<void> {
    const now = new Date();

    const vehicleEntity: VehicleEntity = {
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      recordId: data.recordId,
      vehicleType: data.vehicleType,
      vehicleModel: data.vehicleModel,
      vehicleMake: data.vehicleMake,
      vehicleCapacity: data.vehicleCapacity,
      registrationNumber: data.registrationNumber,
      vehicleImage: data.vehicleImage,
      vehicleStatus: VehicleStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };

    await this._vehicleRepository.save(vehicleEntity);
  }
}
