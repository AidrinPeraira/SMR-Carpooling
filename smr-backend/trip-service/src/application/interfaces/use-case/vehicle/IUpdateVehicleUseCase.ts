import { UpdateVehicleRequestDTO } from "#/application/dto/vehicle/UpdateVehicleRequestDTO";

/**
 * This use case updates existing vehicle data with details from new approved record
 */
export interface IUpdateVehicleUseCase {
  execute(data: UpdateVehicleRequestDTO): Promise<void>;
}
