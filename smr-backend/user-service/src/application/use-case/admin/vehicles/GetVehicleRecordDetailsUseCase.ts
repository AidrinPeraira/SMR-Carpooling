import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IVehicleRecordRepository } from "#/application/interfaces/repository/IVehicleRecordRepository";
import { IGetVehicleRecordDetailsUseCase } from "#/application/interfaces/use-case/admin/vehicles/IGetVehicleRecordDetailsUseCase";
import {
  AdminVehicleRecordDetailsResult,
  ApplicationError,
  ErrorCode,
  GenericErrorMessage,
  HttpStatusCodes,
} from "@sharemyride/shared";

export class GetVehicleRecordDetailsUseCase
  implements IGetVehicleRecordDetailsUseCase
{
  constructor(
    private readonly _vehicleRecordRepository: IVehicleRecordRepository,
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(recordId: string): Promise<AdminVehicleRecordDetailsResult> {
    const record =
      await this._vehicleRecordRepository.findByCustomId(recordId);

    if (!record) {
      throw new ApplicationError(
        GenericErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "GetVehicleRecordDetailsUseCase",
          description: `Vehicle record ${recordId} not found`,
        },
      );
    }

    const application = await this._applicationRepository.findByCustomId(
      record.applicationId,
    );

    if (!application) {
      throw new ApplicationError(
        GenericErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "GetVehicleRecordDetailsUseCase",
          description: `Application ${record.applicationId} not found`,
        },
      );
    }

    const user = await this._userRepository.findByCustomId(application.userId);

    if (!user) {
      throw new ApplicationError(
        GenericErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "GetVehicleRecordDetailsUseCase",
          description: `User ${application.userId} not found`,
        },
      );
    }

    return {
      record_id: record.recordId,
      application_id: record.applicationId,
      vehicle_type: record.vehicleType,
      vehicle_make: record.vehicleMake,
      vehicle_model: record.vehicleModel,
      vehicle_capacity: record.vehicleCapacity,
      vehicle_image: record.vehicleImage,
      registration_number: record.registrationNumber,
      registration_expiry: record.registrationExpiry,
      registration_file: record.registrationFile,
      insurance_number: record.insuranceNumber,
      insurance_expiry: record.insuranceExpiry,
      insurance_file: record.insuranceFile,
      created_at: record.createdAt,
      updated_at: record.updatedAt,
      owner: {
        user_id: user.userId,
        first_name: user.firstName,
        last_name: user.lastName,
        email_id: user.emailId,
      },
      application: {
        application_id: application.applicationId,
        application_type: application.applicationType,
        application_status: application.applicationStatus,
      },
    };
  }
}
