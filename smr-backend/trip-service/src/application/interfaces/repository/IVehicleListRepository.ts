import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { VehicleList } from "#/domain/entities/ConfigurationEntities";
import { VehicleTypes } from "@sharemyride/shared";

/**
 * This is the repository interface for vehicle list' data
 */
export interface IVehicleListRepository extends IBaseRepository<VehicleList> {
  findType(type: VehicleTypes): Promise<VehicleTypes | null>;
}
