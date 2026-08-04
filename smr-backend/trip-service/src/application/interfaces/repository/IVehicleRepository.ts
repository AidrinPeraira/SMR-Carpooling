import { VehicleEntity } from "#/domain/entities/VehicleEntity";

/**
 * Repository interface that handles persistence for
 * vehicles belonging to users
 */
export interface IVehicleRepository {
  save(vehicle: Omit<VehicleEntity, "vehicleId">): Promise<VehicleEntity>;

  updateByRegistrationNumber(
    regNumber: string,
    vehicle: Partial<VehicleEntity>,
  ): Promise<VehicleEntity>;

  findByDriverId(driverId: string): Promise<VehicleEntity[]>;
}
