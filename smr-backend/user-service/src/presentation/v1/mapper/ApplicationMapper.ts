import { NewVehicleApplicationRequestDTO } from "#/application/dto/application/NewVehicleApplicationRequestDTO";
import { OnboardingApplicationRequestDTO } from "#/application/dto/application/OnboardingApplicationRequestDTO";
import { RenewDriverApplicationRequestDTO } from "#/application/dto/application/RenewDriverApplicationRequestDTO";
import { RenewVehicleApplicationRequestDTO } from "#/application/dto/application/RenewVehicleApplicationRequestDTO";
import { ResubmitNewVehicleApplicationRequestDTO } from "#/application/dto/application/ResubmitNewVehicleApplicationRequestDTO";
import { ResubmitOnboardingApplicationRequestDTO } from "#/application/dto/application/ResubmitOnboardingApplicationRequestDTO";
import { ResubmitRenewDriverApplicationRequestDTO } from "#/application/dto/application/ResubmitRenewDriverApplicationRequestDTO";
import { ResubmitRenewVehicleApplicationRequestDTO } from "#/application/dto/application/ResubmitRenewVehicleApplicationRequestDTO";
import { GetApplicationDetailsResultDTO } from "#/application/dto/application/GetApplicationDetailsResultDTO";
import { GetApplicationsResultDTO } from "#/application/dto/application/GetApplicationsResultDTO";
import { GetFileUploadUrlRequestDTO } from "#/application/dto/GetFileUploadUrlRequestDTO";
import { GetFileUploadUrlResponseDTO } from "#/application/dto/GetFileUploadUrlResponseDTO";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import {
  ApplicationDetailsResult,
  ApplicationResult,
  GetFileUploadUrlRequest,
  GetFileUploadUrlResult,
  NewVehicleApplicationRequest,
  OnboardingApplicationRequest,
  RenewDriverApplicationRequest,
  RenewVehicleApplicationRequest,
  ResubmitNewVehicleApplicationRequest,
  ResubmitOnboardingApplicationRequest,
  ResubmitRenewDriverApplicationRequest,
  ResubmitRenewVehicleApplicationRequest,
} from "@sharemyride/shared";

export class ApplicationMapper {
  static toGetFileUploadUrlRequestDTO(
    body: GetFileUploadUrlRequest,
    userId: string,
  ): GetFileUploadUrlRequestDTO {
    return {
      userId,
      fileType: body.file_type,
      fileName: body.file_name,
    };
  }

  static toGetFileUploadUrlResult(
    dto: GetFileUploadUrlResponseDTO,
  ): GetFileUploadUrlResult {
    return {
      url: dto.url,
      expires_at: dto.expiresAt.toISOString(),
    };
  }

  static toOnboardingApplicationRequestDTO(
    body: OnboardingApplicationRequest,
    userId: string,
  ): OnboardingApplicationRequestDTO {
    return {
      userId,
      licenseNumber: body.license_number,
      licenseExpiry: new Date(body.license_expiry),
      licenseFile: body.license_file,
      vehicleType: body.vehicle_type,
      vehicleMake: body.vehicle_make,
      vehicleModel: body.vehicle_model,
      vehicleCapacity: body.vehicle_capacity,
      registrationNumber: body.registration_number,
      registrationExpiry: new Date(body.registration_expiry),
      registrationFile: body.registration_file,
      insuranceNumber: body.insurance_number,
      insuranceExpiry: new Date(body.insurance_expiry),
      insuranceFile: body.insurance_file,
      vehicleImage: body.vehicle_image,
    };
  }

  static toNewVehicleApplicationRequestDTO(
    body: NewVehicleApplicationRequest,
    userId: string,
  ): NewVehicleApplicationRequestDTO {
    return {
      userId,
      vehicleType: body.vehicle_type,
      vehicleMake: body.vehicle_make,
      vehicleModel: body.vehicle_model,
      vehicleCapacity: body.vehicle_capacity,
      registrationNumber: body.registration_number,
      registrationExpiry: new Date(body.registration_expiry),
      registrationFile: body.registration_file,
      insuranceNumber: body.insurance_number,
      insuranceExpiry: new Date(body.insurance_expiry),
      insuranceFile: body.insurance_file,
      vehicleImage: body.vehicle_image,
    };
  }

  static toRenewDriverApplicationRequestDTO(
    body: RenewDriverApplicationRequest,
    userId: string,
  ): RenewDriverApplicationRequestDTO {
    return {
      userId,
      licenseNumber: body.license_number,
      licenseExpiry: new Date(body.license_expiry),
      licenseFile: body.license_file,
    };
  }

  static toRenewVehicleApplicationRequestDTO(
    body: RenewVehicleApplicationRequest,
    userId: string,
  ): RenewVehicleApplicationRequestDTO {
    return {
      userId,
      registrationNumber: body.registration_number,
      registrationExpiry: new Date(body.registration_expiry),
      registrationFile: body.registration_file,
      insuranceNumber: body.insurance_number,
      insuranceExpiry: new Date(body.insurance_expiry),
      insuranceFile: body.insurance_file,
    };
  }

  static toResubmitOnboardingApplicationRequestDTO(
    body: ResubmitOnboardingApplicationRequest,
    applicationId: string,
  ): ResubmitOnboardingApplicationRequestDTO {
    return {
      applicationId,
      licenseNumber: body.license_number,
      licenseExpiry: body.license_expiry
        ? new Date(body.license_expiry)
        : undefined,
      licenseFile: body.license_file,
      vehicleType: body.vehicle_type,
      vehicleMake: body.vehicle_make,
      vehicleModel: body.vehicle_model,
      vehicleCapacity: body.vehicle_capacity,
      registrationNumber: body.registration_number,
      registrationExpiry: body.registration_expiry
        ? new Date(body.registration_expiry)
        : undefined,
      registrationFile: body.registration_file,
      insuranceNumber: body.insurance_number,
      insuranceExpiry: body.insurance_expiry
        ? new Date(body.insurance_expiry)
        : undefined,
      insuranceFile: body.insurance_file,
      vehicleImage: body.vehicle_image,
    };
  }

  static toResubmitNewVehicleApplicationRequestDTO(
    body: ResubmitNewVehicleApplicationRequest,
    applicationId: string,
  ): ResubmitNewVehicleApplicationRequestDTO {
    return {
      applicationId,
      vehicleType: body.vehicle_type,
      vehicleMake: body.vehicle_make,
      vehicleModel: body.vehicle_model,
      vehicleCapacity: body.vehicle_capacity,
      registrationNumber: body.registration_number,
      registrationExpiry: body.registration_expiry
        ? new Date(body.registration_expiry)
        : undefined,
      registrationFile: body.registration_file,
      insuranceNumber: body.insurance_number,
      insuranceExpiry: body.insurance_expiry
        ? new Date(body.insurance_expiry)
        : undefined,
      insuranceFile: body.insurance_file,
      vehicleImage: body.vehicle_image,
    };
  }

  static toResubmitRenewDriverApplicationRequestDTO(
    body: ResubmitRenewDriverApplicationRequest,
    applicationId: string,
  ): ResubmitRenewDriverApplicationRequestDTO {
    return {
      applicationId,
      licenseNumber: body.license_number,
      licenseExpiry: body.license_expiry
        ? new Date(body.license_expiry)
        : undefined,
      licenseFile: body.license_file,
    };
  }

  static toResubmitRenewVehicleApplicationRequestDTO(
    body: ResubmitRenewVehicleApplicationRequest,
    applicationId: string,
  ): ResubmitRenewVehicleApplicationRequestDTO {
    return {
      applicationId,
      registrationNumber: body.registration_number,
      registrationExpiry: body.registration_expiry
        ? new Date(body.registration_expiry)
        : undefined,
      registrationFile: body.registration_file,
      insuranceNumber: body.insurance_number,
      insuranceExpiry: body.insurance_expiry
        ? new Date(body.insurance_expiry)
        : undefined,
      insuranceFile: body.insurance_file,
    };
  }

  static toApplicationResult(
    entity: ApplicationEntity,
  ): ApplicationResult {
    return {
      application_id: entity.applicationId,
      user_id: entity.userId,
      application_type: entity.applicationType,
      application_status: entity.applicationStatus,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      admin_comments: entity.adminComments?.map((c) => ({
        comment: c.comment,
        admin_id: c.adminId,
        time: c.time,
      })),
    };
  }

  static toGetApplicationsSummaryResult(
    dto: GetApplicationsResultDTO,
    userId: string,
  ): ApplicationResult {
    return {
      application_id: dto.applicationId,
      user_id: userId,
      application_type: dto.applicationType,
      application_status: dto.applicationStatus,
      created_at: dto.createdAt,
      updated_at: dto.createdAt,
    };
  }

  static toApplicationDetailsResult(
    dto: GetApplicationDetailsResultDTO,
  ): ApplicationDetailsResult {
    return {
      application_id: dto.applicationId,
      user_id: dto.userId,
      application_type: dto.applicationType,
      application_status: dto.applicationStatus,
      created_at: dto.createdAt,
      updated_at: dto.updatedAt,
      first_name: dto.firstName,
      last_name: dto.lastName,
      email_id: dto.emailId,
      admin_comments: dto.adminComments?.map((c) => ({
        comment: c.comment,
        admin_id: c.adminId,
        time: c.time,
      })),
      driver_record: dto.driverRecord?.map((d) => ({
        record_id: d.recordId,
        user_id: dto.userId,
        license_number: d.licenseNumber,
        license_expiry: d.licenseExpiry,
        license_file: d.licenseFile,
      })),
      vehicle_record: dto.vehicleRecord?.map((v) => ({
        record_id: v.recordId,
        user_id: dto.userId,
        vehicle_type: v.vehicleType,
        vehicle_make: v.vehicleMake,
        vehicle_model: v.vehicleModel,
        vehicle_capacity: v.vehicleCapacity,
        registration_number: v.registrationNumber,
        registration_expiry: v.registrationExpiry,
        registration_file: v.registrationFile,
        insurance_number: v.insuranceNumber || "",
        insurance_expiry: v.insuranceExpiry,
        insurance_file: v.insuranceFile,
        vehicle_image: v.vehicleImage,
      })),
    };
  }
}
