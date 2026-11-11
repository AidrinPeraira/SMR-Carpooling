import { VehicleDetailsDTO } from "#/application/dto/vehicle/VehicleDetailsDTO";
import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import { IGetDriverVehiclesUseCase } from "#/application/interfaces/use-case/vehicle/IGetDriverVehiclesUseCase";

export class GetDriverVehiclesUseCase implements IGetDriverVehiclesUseCase {
  constructor(private readonly _vehicleRepository: IVehicleRepository) {}

  async execute(driverId: string): Promise<VehicleDetailsDTO[]> {
    const vehicles = await this._vehicleRepository.findByDriverId(driverId);
    return vehicles.map((v) => ({
      vehicleId: v.vehicleId,
      driverId: v.driverId,
      recordId: v.recordId,
      vehicleType: v.vehicleType,
      vehicleModel: v.vehicleModel,
      vehicleMake: v.vehicleMake,
      vehicleCapacity: v.vehicleCapacity,
      registrationNumber: v.registrationNumber,
      vehicleImage: v.vehicleImage,
      vehicleStatus: v.vehicleStatus,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));
  }
}
