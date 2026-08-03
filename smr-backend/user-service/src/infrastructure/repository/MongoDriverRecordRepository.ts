import { IDriverRecordRepository } from "#/application/interfaces/repository/IDriverRecordRepository";
import { DriverRecordEntity } from "#/domain/entities/DriverRecordEntity";
import { DriverRecordDoc } from "#/infrastructure/database/models/MongoDriverRecordModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import { Model } from "mongoose";

export class MongoDriverRecordRepository
  extends MongoBaseRepository<DriverRecordEntity, DriverRecordDoc>
  implements IDriverRecordRepository
{
  private readonly _driverRecordModel: Model<DriverRecordDoc>;

  constructor(driverRecordModel: Model<DriverRecordDoc>) {
    super("recordId", driverRecordModel);
    this._driverRecordModel = driverRecordModel;
  }

  protected toDomainEntityMapper(data: DriverRecordDoc): DriverRecordEntity {
    return {
      recordId: data.recordId,
      applicationId: data.applicationId,
      licenseNumber: data.licenseNumber,
      licenseExpiry: data.licenseExpiry,
      licenseFile: data.licenseFile,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findByApplicationId(applicationId: string): Promise<DriverRecordEntity | null> {
    const doc = await this._driverRecordModel.findOne({ applicationId });
    return doc ? this.toDomainEntityMapper(doc) : null;
  }

  async findByLicenseNumber(licenseNumber: string): Promise<DriverRecordEntity[]> {
    const docs = await this._driverRecordModel.find({ licenseNumber });
    return docs.map((doc) => this.toDomainEntityMapper(doc));
  }
}
