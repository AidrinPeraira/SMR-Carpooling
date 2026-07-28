import { VehicleList } from "#/domain/entities/ConfigurationEntities";
import { VehicleTypes } from "@sharemyride/shared";

/**
 * This is the repository interface for vehicle list' data
 */
export interface IVehicleListRepository {
  save(data: Omit<VehicleList, "id">): Promise<VehicleList>;

  findExistingVehicle(
    type: VehicleTypes,
    make: string,
    model: string,
  ): Promise<VehicleList | null>;

  findAll(): Promise<VehicleList[] | null>;

  updateById(id: string, data: Partial<VehicleList>): Promise<VehicleList>;
}
