import { VehicleList } from "#/domain/entities/ConfigurationEntities";
import { QueryDTO, VehicleTypes } from "@sharemyride/shared";

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

  findAll(query?: QueryDTO<VehicleList>): Promise<VehicleList[] | null>;

  updateById(id: string, data: Partial<VehicleList>): Promise<VehicleList>;
}
