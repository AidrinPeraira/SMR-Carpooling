import { VehicleEntity } from "#/domain/entities/VehicleEntity";

/**
 * This is the repository that handles persistence for
 * vehicles belonging to the users
 */
export interface IVehicleRepository {
  //omit vehicleId so that it is populated by the db
  save(vehicle: Omit<VehicleEntity, "vehicleId">): Promise<VehicleEntity>;

  updateByRegistrationNumber(
    regNumber: string,
    vehicle: Partial<VehicleEntity>,
  ): Promise<VehicleEntity>;
}
