import { OnboardingApplicationRequestDTO } from "#/application/dto/application/OnboardingApplicationRequestDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IDriverRecordRepository } from "#/application/interfaces/repository/IDriverRecordRepository";
import { IVehicleRecordRepository } from "#/application/interfaces/repository/IVehicleRecordRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { IOnboardingApplicationUseCase } from "#/application/interfaces/use-case/application/IOnboardinApplicationUseCase";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { DriverRecordEntity } from "#/domain/entities/DriverRecordEntity";
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
 * Implementation for the use case that handles creating a new
 * onboarding application. It creates both a new driver and vehicle record.
 */
export class OnboardingApplicationUseCase implements IOnboardingApplicationUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _vehicleRecordRepository: IVehicleRecordRepository,
    private readonly _driverRecordRepository: IDriverRecordRepository,
    private readonly _uniqueIdGenerator: IUniqueIdGenerator,
    private readonly _storageService: IStorageService,
  ) {}

  /**
   * Validates input data and creates a new onboarding application
   * along with driver and vehicle records.
   *
   * @param data Onboarding application data
   */
  async execute(data: OnboardingApplicationRequestDTO): Promise<void> {
    if (data.vehicleCapacity <= 0 || data.vehicleCapacity > 10) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        ErrorDetails.INPUT_VALIDATION_ERROR,
        {
          location: "OnboardingApplicationUseCase - execute",
          description: "Vehicle capacity must be between 1 and 10 seats",
        },
      );
    }

    const applicationId = this._uniqueIdGenerator.generateRandomId();
    const now = new Date();

    const applicationData: Omit<ApplicationEntity, "id"> = {
      applicationId,
      userId: data.userId,
      applicationType: ApplicationType.ONBOARDING,
      applicationStatus: ApplicationStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    await this._applicationRepository.save(applicationData);

    //move files
    const getDestinationPath = (filePath: string): string => {
      return filePath.startsWith("temp/") ? filePath.slice(5) : filePath;
    };

    const driverRecordId = this._uniqueIdGenerator.generateRandomId();

    const finalLicenseFile = getDestinationPath(data.licenseFile);
    await this._storageService.moveFile(data.licenseFile, finalLicenseFile);

    //save driver record
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

    //move files
    const finalVehicleImage = getDestinationPath(data.vehicleImage);
    const finalRegistrationFile = getDestinationPath(data.registrationFile);
    const finalInsuranceFile = getDestinationPath(data.insuranceFile);

    await this._storageService.moveFile(data.vehicleImage, finalVehicleImage);
    await this._storageService.moveFile(
      data.registrationFile,
      finalRegistrationFile,
    );
    await this._storageService.moveFile(data.insuranceFile, finalInsuranceFile);

    const vehicleRecordId = this._uniqueIdGenerator.generateRandomId();

    //save vehicle record;
    const vehicleRecordData: Omit<VehicleRecordEntity, "id"> = {
      recordId: vehicleRecordId,
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
  }
}
