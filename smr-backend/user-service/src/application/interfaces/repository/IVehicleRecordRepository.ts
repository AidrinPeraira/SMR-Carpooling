import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";

export interface IVehicleRecordRepository
  extends IBaseRepository<VehicleRecordEntity> {
  findByApplicationId(
    applicationId: string,
  ): Promise<VehicleRecordEntity | null>;

  findByRegistrationNumber(
    registrationNumber: string,
  ): Promise<VehicleRecordEntity[]>;
}
