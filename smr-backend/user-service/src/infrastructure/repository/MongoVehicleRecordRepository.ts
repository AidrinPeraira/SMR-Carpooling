import { IVehicleRecordRepository } from "#/application/interfaces/repository/IVehicleRecordRepository";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";
import { VehicleRecordDoc } from "#/infrastructure/database/models/MongoVehicleRecordModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import { Model } from "mongoose";

export class MongoVehicleRecordRepository
  extends MongoBaseRepository<VehicleRecordEntity, VehicleRecordDoc>
  implements IVehicleRecordRepository
{
  private readonly _vehicleRecordModel: Model<VehicleRecordDoc>;

  constructor(vehicleRecordModel: Model<VehicleRecordDoc>) {
    super("recordId", vehicleRecordModel);
    this._vehicleRecordModel = vehicleRecordModel;
  }

  protected toDomainEntityMapper(data: VehicleRecordDoc): VehicleRecordEntity {
    return {
      recordId: data.recordId,
      applicationId: data.applicationId,
      vehicleType: data.vehicleType,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleCapacity: data.vehicleCapacity,
      registrationNumber: data.registrationNumber,
      registrationExpiry: data.registrationExpiry,
      registrationFile: data.registrationFile,
      insuranceNumber: data.insuranceNumber || "",
      insuranceExpiry: data.insuranceExpiry,
      insuranceFile: data.insuranceFile,
      vehicleImage: data.vehicleImage,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findByApplicationId(applicationId: string): Promise<VehicleRecordEntity | null> {
    const doc = await this._vehicleRecordModel.findOne({ applicationId });
    return doc ? this.toDomainEntityMapper(doc) : null;
  }

  async findByRegistrationNumber(
    registrationNumber: string,
  ): Promise<VehicleRecordEntity[]> {
    const docs = await this._vehicleRecordModel.find({ registrationNumber });
    return docs.map((doc) => this.toDomainEntityMapper(doc));
  }
}
