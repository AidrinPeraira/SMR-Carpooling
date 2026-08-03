import { RenewVehicleApplicationRequestDTO } from "#/application/dto/application/RenewVehicleApplicationRequestDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IVehicleRecordRepository } from "#/application/interfaces/repository/IVehicleRecordRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { IRenewVehicleApplicationUseCase } from "#/application/interfaces/use-case/application/IRenewVehicleApplicationUseCase";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";
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
 * This class implements the use case to create a new renewal application
 * for expired vehicle records
 */
export class RenewVehicleApplicationUseCase implements IRenewVehicleApplicationUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _vehicleRecordRepository: IVehicleRecordRepository,
    private readonly _uniqueIdGenerator: IUniqueIdGenerator,
    private readonly _storageService: IStorageService,
  ) {}

  /**
   * This method takes the vehicle renewal data and creates a new
   * vehicle application and record if existing vehicle records are expired.
   *
   * @param data : Vehicle renewal details
   */
  async execute(data: RenewVehicleApplicationRequestDTO): Promise<void> {
    const existingRecords =
      await this._vehicleRecordRepository.findByRegistrationNumber(
        data.registrationNumber,
      );

    if (!existingRecords || existingRecords.length === 0) {
      throw new ApplicationError(
        ApplicationErrorMessage.VEHICLE_RECORD_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "RenewVehicleApplicationUseCase - execute",
          description: ApplicationErrorMessage.VEHICLE_RECORD_NOT_FOUND,
        },
      );
    }

    const hasValidRecord = existingRecords.some(
      (record) =>
        new Date(record.registrationExpiry) > new Date() &&
        new Date(record.insuranceExpiry) > new Date(),
    );

    if (hasValidRecord) {
      throw new ApplicationError(
        ApplicationErrorMessage.CANNOT_RENEW_VALID_RECORD,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "RenewVehicleApplicationUseCase - execute",
          description: ApplicationErrorMessage.CANNOT_RENEW_VALID_RECORD,
        },
      );
    }

    const baseRecord = existingRecords[existingRecords.length - 1]!;

    const applicationId = this._uniqueIdGenerator.generateRandomId();
    const now = new Date();

    const applicationData: Omit<ApplicationEntity, "id"> = {
      applicationId,
      userId: data.userId,
      applicationType: ApplicationType.RENEW_VEHICLE,
      applicationStatus: ApplicationStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    await this._applicationRepository.save(applicationData);

    const getDestinationPath = (filePath: string): string => {
      return filePath.startsWith("temp/") ? filePath.slice(5) : filePath;
    };

    const finalRegistrationFile = getDestinationPath(data.registrationFile);
    const finalInsuranceFile = getDestinationPath(data.insuranceFile);

    await this._storageService.moveFile(
      data.registrationFile,
      finalRegistrationFile,
    );
    await this._storageService.moveFile(data.insuranceFile, finalInsuranceFile);

    const recordId = this._uniqueIdGenerator.generateRandomId();

    const vehicleRecordData: Omit<VehicleRecordEntity, "id"> = {
      recordId,
      applicationId,
      vehicleType: baseRecord.vehicleType,
      vehicleModel: baseRecord.vehicleModel,
      vehicleMake: baseRecord.vehicleMake,
      vehicleImage: baseRecord.vehicleImage,
      vehicleCapacity: baseRecord.vehicleCapacity,
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
  }
}
