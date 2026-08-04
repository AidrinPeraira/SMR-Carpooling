import { NewVehicleApplicationRequestDTO } from "#/application/dto/application/NewVehicleApplicationRequestDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IVehicleRecordRepository } from "#/application/interfaces/repository/IVehicleRecordRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { INewVehicleApplicationUseCase } from "#/application/interfaces/use-case/application/INewVehicleApplicationUseCase";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";
import {
  ApplicationError,
  ApplicationStatus,
  ApplicationType,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * Implementation for the use case to create a new application
 * to add new vehicle. It creates a new application and vehicle record.
 * Includes rollback handling (files and records) on error.
 */
export class NewVehicleApplicationUseCase implements INewVehicleApplicationUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _vehicleRecordRepository: IVehicleRecordRepository,
    private readonly _uniqueIdGenerator: IUniqueIdGenerator,
    private readonly _storageService: IStorageService,
  ) {}

  /**
   * Validates application data and creates a new application
   * and corresponding vehicle record. Rolls back application and files on failure.
   *
   * @param data Vehicle application data
   */
  async execute(data: NewVehicleApplicationRequestDTO): Promise<void> {
    if (data.vehicleCapacity <= 0 || data.vehicleCapacity > 10) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        ErrorDetails.INPUT_VALIDATION_ERROR,
        {
          location: "NewVehicleApplicationUseCase - execute",
          description: "Vehicle capacity must be between 1 and 10 seats",
        },
      );
    }

    let applicationId: string | undefined;
    let recordId: string | undefined;
    const movedFiles: { from: string; to: string }[] = [];

    try {
      applicationId = this._uniqueIdGenerator.generateRandomId();
      const now = new Date();

      const applicationData: Omit<ApplicationEntity, "id"> = {
        applicationId,
        userId: data.userId,
        applicationType: ApplicationType.NEW_VEHICLE,
        applicationStatus: ApplicationStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      };

      await this._applicationRepository.save(applicationData);

      // move the files
      const getDestinationPath = (filePath: string): string => {
        return filePath.startsWith("temp/") ? filePath.slice(5) : filePath;
      };

      const finalVehicleImage = getDestinationPath(data.vehicleImage);
      if (finalVehicleImage !== data.vehicleImage) {
        await this._storageService.moveFile(data.vehicleImage, finalVehicleImage);
        movedFiles.push({ from: data.vehicleImage, to: finalVehicleImage });
      }

      const finalRegistrationFile = getDestinationPath(data.registrationFile);
      if (finalRegistrationFile !== data.registrationFile) {
        await this._storageService.moveFile(
          data.registrationFile,
          finalRegistrationFile,
        );
        movedFiles.push({ from: data.registrationFile, to: finalRegistrationFile });
      }

      const finalInsuranceFile = getDestinationPath(data.insuranceFile);
      if (finalInsuranceFile !== data.insuranceFile) {
        await this._storageService.moveFile(data.insuranceFile, finalInsuranceFile);
        movedFiles.push({ from: data.insuranceFile, to: finalInsuranceFile });
      }

      recordId = this._uniqueIdGenerator.generateRandomId();

      // save records
      const vehicleRecordData: Omit<VehicleRecordEntity, "id"> = {
        recordId,
        applicationId,
        vehicleType: data.vehicleType,
        vehicleModel: data.vehicleModel,
        vehicleMake: data.vehicleMake,
        vehicleImage: finalVehicleImage,
        vehicleCapacity: data.vehicleCapacity,
        registrationNumber: data.registrationNumber,
        registrationExpiry: data.registrationExpiry,
        registrationFile: finalRegistrationFile,
        insuranceNumber: data.insuranceNumber || "",
        insuranceExpiry: data.insuranceExpiry,
        insuranceFile: finalInsuranceFile,
        createdAt: now,
        updatedAt: now,
      };

      await this._vehicleRecordRepository.save(vehicleRecordData);
    } catch (error) {
      // Revert moved files back to temp
      for (const file of movedFiles) {
        await this._storageService.moveFile(file.to, file.from).catch(() => {});
      }

      // Rollback database records
      if (applicationId) {
        await this._applicationRepository.deleteByCustomId(applicationId).catch(() => {});
      }
      if (recordId) {
        await this._vehicleRecordRepository.deleteByCustomId(recordId).catch(() => {});
      }

      throw error;
    }
  }
}
