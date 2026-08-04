import { ResubmitRenewDriverApplicationRequestDTO } from "#/application/dto/application/ResubmitRenewDriverApplicationRequestDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IDriverRecordRepository } from "#/application/interfaces/repository/IDriverRecordRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IResubmitRenewDriverApplicationUseCase } from "#/application/interfaces/use-case/application/IResubmitRenewDriverApplicationUseCase";
import { DriverRecordEntity } from "#/domain/entities/DriverRecordEntity";
import {
  ApplicationError,
  ApplicationErrorMessage,
  ApplicationStatus,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * Implementation for the use case that handles resubmitting
 * a returned driver renewal application and updating the driver record.
 */
export class ResubmitRenewDriverApplicationUseCase
  implements IResubmitRenewDriverApplicationUseCase
{
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _driverRecordRepository: IDriverRecordRepository,
    private readonly _storageService: IStorageService,
  ) {}

  async execute(data: ResubmitRenewDriverApplicationRequestDTO): Promise<void> {
    const existingApplication =
      await this._applicationRepository.findByCustomId(data.applicationId);

    if (!existingApplication) {
      throw new ApplicationError(
        ApplicationErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ResubmitRenewDriverApplicationUseCase - execute",
          description: ApplicationErrorMessage.NOT_FOUND,
        },
      );
    }

    if (existingApplication.applicationStatus !== ApplicationStatus.RETURNED) {
      throw new ApplicationError(
        ApplicationErrorMessage.INVALID_APPLICATION_STATUS,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "ResubmitRenewDriverApplicationUseCase - execute",
          description: "Only returned applications can be resubmitted.",
        },
      );
    }

    const driverRecord =
      await this._driverRecordRepository.findByApplicationId(data.applicationId);

    if (!driverRecord) {
      throw new ApplicationError(
        ApplicationErrorMessage.DRIVER_RECORD_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ResubmitRenewDriverApplicationUseCase - execute",
          description: ApplicationErrorMessage.DRIVER_RECORD_NOT_FOUND,
        },
      );
    }

    const getDestinationPath = (filePath: string): string => {
      return filePath.startsWith("temp/") ? filePath.slice(5) : filePath;
    };

    const driverUpdate: Partial<DriverRecordEntity> = {};
    if (data.licenseNumber !== undefined) {
      driverUpdate.licenseNumber = data.licenseNumber;
    }
    if (data.licenseExpiry !== undefined) {
      driverUpdate.licenseExpiry = data.licenseExpiry;
    }
    if (data.licenseFile !== undefined) {
      const finalLicenseFile = getDestinationPath(data.licenseFile);
      await this._storageService.moveFile(data.licenseFile, finalLicenseFile);
      if (driverRecord.licenseFile) {
        await this._storageService.deleteFile(driverRecord.licenseFile);
      }
      driverUpdate.licenseFile = finalLicenseFile;
    }

    if (Object.keys(driverUpdate).length > 0) {
      driverUpdate.updatedAt = new Date();
      await this._driverRecordRepository.updateByCustomId(
        driverRecord.recordId,
        driverUpdate,
      );
    }

    await this._applicationRepository.updateByCustomId(data.applicationId, {
      applicationStatus: ApplicationStatus.PENDING,
      updatedAt: new Date(),
    });
  }
}
