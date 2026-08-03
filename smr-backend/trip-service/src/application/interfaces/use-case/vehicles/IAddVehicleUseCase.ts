import { AddVehicleRequestDTO } from "#/application/dto/vehicle/AddVehicleRequestDTO";

/**
 * THis use case creates a new vehicle from vehicle data received from
 * event handler that listens for application approval events
 */
export interface IAddVehicleUseCase {
  execute(data: AddVehicleRequestDTO): Promise<void>;
}
