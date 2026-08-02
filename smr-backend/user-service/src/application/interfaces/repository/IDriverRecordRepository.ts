import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { DriverRecordEntity } from "#/domain/entities/DriverRecordEntity";

export interface IDriverRecordRepository
  extends IBaseRepository<DriverRecordEntity> {
  findByApplicationId(
    applicationId: string,
  ): Promise<DriverRecordEntity | null>;

  findByLicenseNumber(
    licenseNumber: string,
  ): Promise<DriverRecordEntity[]>;
}
