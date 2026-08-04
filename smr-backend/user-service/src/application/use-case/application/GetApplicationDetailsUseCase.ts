import { GetApplicationDetailsResultDTO } from "#/application/dto/application/GetApplicationDetailsResultDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IGetApplicationDetailsUseCase } from "#/application/interfaces/use-case/application/IGetApplicationDetailsUseCase";
import {
  ApplicationError,
  ApplicationErrorMessage,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

const SIGNED_URL_TTL_SECONDS = 3600; // 1 hour

/**
 * Implementation for the use case to get full application details with signed file URLs
 */
export class GetApplicationDetailsUseCase implements IGetApplicationDetailsUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _storageService: IStorageService,
  ) {}

  /**
   * Gets full details of an application, checks existence, and transforms file paths into presigned URLs
   *
   * @param applicationId : ID of the application
   * @returns full application details with signed URLs
   */
  async execute(
    applicationId: string,
  ): Promise<GetApplicationDetailsResultDTO> {
    const application =
      await this._applicationRepository.getFullApplicationDetails(
        applicationId,
      );

    if (!application) {
      throw new ApplicationError(
        ApplicationErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "GetApplicationDetailsUseCase",
          description: "Application not found",
        },
      );
    }

    const driverRecord = await Promise.all(
      (application.driverRecord || []).map(async (d) => {
        let signedLicenseFile = d.licenseFile;
        if (d.licenseFile) {
          try {
            signedLicenseFile =
              await this._storageService.generateSignedDownloadURL(
                d.licenseFile,
                SIGNED_URL_TTL_SECONDS,
              );
          } catch {
            // Keep original value if presigned URL generation fails
          }
        }
        return {
          ...d,
          licenseFile: signedLicenseFile,
        };
      }),
    );

    const vehicleRecord = await Promise.all(
      (application.vehicleRecord || []).map(async (v) => {
        let signedRegistrationFile = v.registrationFile;
        let signedInsuranceFile = v.insuranceFile;
        let signedVehicleImage = v.vehicleImage;

        if (v.registrationFile) {
          try {
            signedRegistrationFile =
              await this._storageService.generateSignedDownloadURL(
                v.registrationFile,
                SIGNED_URL_TTL_SECONDS,
              );
          } catch {
            // Keep original value if presigned URL generation fails
          }
        }

        if (v.insuranceFile) {
          try {
            signedInsuranceFile =
              await this._storageService.generateSignedDownloadURL(
                v.insuranceFile,
                SIGNED_URL_TTL_SECONDS,
              );
          } catch {
            // Keep original value if presigned URL generation fails
          }
        }

        if (v.vehicleImage) {
          try {
            signedVehicleImage =
              await this._storageService.generateSignedDownloadURL(
                v.vehicleImage,
                SIGNED_URL_TTL_SECONDS,
              );
          } catch {
            // Keep original value if presigned URL generation fails
          }
        }

        return {
          ...v,
          registrationFile: signedRegistrationFile,
          insuranceFile: signedInsuranceFile,
          vehicleImage: signedVehicleImage,
        };
      }),
    );

    return {
      ...application,
      driverRecord,
      vehicleRecord,
    };
  }
}
