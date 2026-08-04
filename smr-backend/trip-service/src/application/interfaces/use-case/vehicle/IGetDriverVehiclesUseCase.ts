import { VehicleDetailsDTO } from "#/application/dto/vehicle/VehicleDetailsDTO";

export interface IGetDriverVehiclesUseCase {
  execute(driverId: string): Promise<VehicleDetailsDTO[]>;
}
