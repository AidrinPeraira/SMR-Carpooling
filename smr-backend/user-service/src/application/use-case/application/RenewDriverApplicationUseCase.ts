import { RenewDriverApplicationRequsetDTO } from "#/application/dto/application/RenewDriverApplicationRequestDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IDriverRecordRepository } from "#/application/interfaces/repository/IDriverRecordRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { IRenewDriverApplicationUseCase } from "#/application/interfaces/use-case/application/IRenewDriverApplicationUseCase";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { DriverRecordEntity } from "#/domain/entities/DriverRecordEntity";
import {
  ApplicationError,
  ApplicationErrorMessage,
  ApplicationStatus,
  ApplicationType,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * This is the implementation for the use case that creates a new application to
 * renew expired driver records.
 */
export class RenewDriverApplicationUseCase implements IRenewDriverApplicationUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _driverRecordRepository: IDriverRecordRepository,
    private readonly _uniqueIdGenerator: IUniqueIdGenerator,
    private readonly _storageService: IStorageService,
  ) {}

  /**
   * This method creates a new driver application and a driver record
   * if existing driver records are expired/invalid.
   *
   * @param data : Driver license details
   */
  async execute(data: RenewDriverApplicationRequsetDTO): Promise<void> {
    const existingRecords = await this._driverRecordRepository.findByLicenseNumber(
      data.licenseNumber,
    );

    if (!existingRecords || existingRecords.length === 0) {
      throw new ApplicationError(
        ApplicationErrorMessage.DRIVER_RECORD_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "RenewDriverApplicationUseCase - execute",
          description: ApplicationErrorMessage.DRIVER_RECORD_NOT_FOUND,
        },
      );
    }

    const hasValidRecord = existingRecords.some(
      (record) => new Date(record.licenseExpiry) > new Date(),
    );

    if (hasValidRecord) {
      throw new ApplicationError(
        ApplicationErrorMessage.CANNOT_RENEW_VALID_RECORD,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "RenewDriverApplicationUseCase - execute",
          description: ApplicationErrorMessage.CANNOT_RENEW_VALID_RECORD,
        },
      );
    }

    const applicationId = this._uniqueIdGenerator.generateRandomId();
    const now = new Date();

    const applicationData: Omit<ApplicationEntity, "id"> = {
      applicationId,
      userId: data.userId,
      applicationType: ApplicationType.RENEW_DRIVER,
      applicationStatus: ApplicationStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    await this._applicationRepository.save(applicationData);

    const getDestinationPath = (filePath: string): string => {
      return filePath.startsWith("temp/") ? filePath.slice(5) : filePath;
    };

    const finalLicenseFile = getDestinationPath(data.licenseFile);
    await this._storageService.moveFile(data.licenseFile, finalLicenseFile);

    const driverRecordId = this._uniqueIdGenerator.generateRandomId();

    const driverRecordData: Omit<DriverRecordEntity, "id"> = {
      recordId: driverRecordId,
      applicationId,
      licenseNumber: data.licenseNumber,
      licenseExpiry: data.licenseExpiry,
      licenseFile: finalLicenseFile,
      createdAt: now,
      updatedAt: now,
    };

    await this._driverRecordRepository.save(driverRecordData);
  }
}
