import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListReposiory";
import { VehicleListEntity } from "#/domain/entities/VehicleListEntity";
import {
  MongoVehicleListModel,
  VehicleListDoc,
} from "#/infrastructure/database/models/MongoVehicleListModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import { Model } from "mongoose";

export class MongoVehicleListRepository
  extends MongoBaseRepository<VehicleListEntity, VehicleListDoc>
  implements IVehicleListRepository
{
  constructor(model: Model<VehicleListDoc> = MongoVehicleListModel) {
    super("vehicleId", model);
  }

  protected toDomainEntityMapper(data: VehicleListDoc): VehicleListEntity {
    return {
      id: data._id.toString(),
      vehicleId: data.vehicleId,
      vehicleType: data.vehicleType,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      isActive: data.isActive,
    };
  }
}
