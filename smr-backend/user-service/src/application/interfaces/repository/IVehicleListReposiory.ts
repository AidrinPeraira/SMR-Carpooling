import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { VehicleListEntity } from "#/domain/entities/VehicleListEntity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IVehicleListRepository
  extends IBaseRepository<VehicleListEntity> {}
