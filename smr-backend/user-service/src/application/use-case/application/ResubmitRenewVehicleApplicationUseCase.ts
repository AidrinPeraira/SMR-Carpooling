import { ResubmitRenewVehicleApplicationRequestDTO } from "#/application/dto/application/ResubmitRenewVehicleApplicationRequestDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IVehicleRecordRepository } from "#/application/interfaces/repository/IVehicleRecordRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IResubmitRenewVehicleApplicationUseCase } from "#/application/interfaces/use-case/application/IResubmitRenewVehicleApplicationUseCase";
import { BaseApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";
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
 * a returned vehicle renewal application and updating the vehicle record.
 */
export class ResubmitRenewVehicleApplicationUseCase
  implements IResubmitRenewVehicleApplicationUseCase
{
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _vehicleRecordRepository: IVehicleRecordRepository,
    private readonly _storageService: IStorageService,
  ) {}

  async execute(data: ResubmitRenewVehicleApplicationRequestDTO): Promise<void> {
    const existingApplication =
      await this._applicationRepository.findByCustomId(data.applicationId);

    if (!existingApplication) {
      throw new ApplicationError(
        ApplicationErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ResubmitRenewVehicleApplicationUseCase - execute",
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
          location: "ResubmitRenewVehicleApplicationUseCase - execute",
          description: "Only returned applications can be resubmitted.",
        },
      );
    }

    const vehicleRecord =
      await this._vehicleRecordRepository.findByApplicationId(data.applicationId);

    if (!vehicleRecord) {
      throw new ApplicationError(
        ApplicationErrorMessage.VEHICLE_RECORD_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ResubmitRenewVehicleApplicationUseCase - execute",
          description: ApplicationErrorMessage.VEHICLE_RECORD_NOT_FOUND,
        },
      );
    }

    const getDestinationPath = (filePath: string): string => {
      return filePath.startsWith("temp/") ? filePath.slice(5) : filePath;
    };

    const vehicleUpdate: Partial<VehicleRecordEntity> = {};
    if (data.registrationNumber !== undefined) {
      vehicleUpdate.registrationNumber = data.registrationNumber;
    }
    if (data.registrationExpiry !== undefined) {
      vehicleUpdate.registrationExpiry = data.registrationExpiry;
    }
    if (data.registrationFile !== undefined) {
      const finalRegistrationFile = getDestinationPath(data.registrationFile);
      await this._storageService.moveFile(
        data.registrationFile,
        finalRegistrationFile,
      );
      if (vehicleRecord.registrationFile) {
        await this._storageService.deleteFile(vehicleRecord.registrationFile);
      }
      vehicleUpdate.registrationFile = finalRegistrationFile;
    }
    if (data.insuranceNumber !== undefined) {
      vehicleUpdate.insuranceNumber = data.insuranceNumber;
    }
    if (data.insuranceExpiry !== undefined) {
      vehicleUpdate.insuranceExpiry = data.insuranceExpiry;
    }
    if (data.insuranceFile !== undefined) {
      const finalInsuranceFile = getDestinationPath(data.insuranceFile);
      await this._storageService.moveFile(
        data.insuranceFile,
        finalInsuranceFile,
      );
      if (vehicleRecord.insuranceFile) {
        await this._storageService.deleteFile(vehicleRecord.insuranceFile);
      }
      vehicleUpdate.insuranceFile = finalInsuranceFile;
    }

    if (Object.keys(vehicleUpdate).length > 0) {
      vehicleUpdate.updatedAt = new Date();
      await this._vehicleRecordRepository.updateByCustomId(
        vehicleRecord.recordId,
        vehicleUpdate,
      );
    }

    await this._applicationRepository.updateByCustomId(data.applicationId, {
      applicationStatus: ApplicationStatus.PENDING,
      updatedAt: new Date(),
    } as Partial<BaseApplicationEntity>);
  }
}
