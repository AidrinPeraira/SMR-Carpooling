import {
  CreateNewVehicleRequestDTO,
  CreateNewVehicleResultDTO,
} from "#/application/dto/admin/ConfigurationDTO";

/*
 * This use case should create a new vehicle for the trip service configuration.
 * This is for the users to select to add their own vehicles.
 *  - It creates new vehicle
 *  - Updates in-memory store with updated config data
 *  - Publishes an event for user service to store vehicle data
 */
export interface ICreateNewVehicleUseCase {
  execute(data: CreateNewVehicleRequestDTO): Promise<CreateNewVehicleResultDTO>;
}
