import { ProcessApplicationRequestDTO } from "#/application/dto/admin/application/AdminApplicationsDTO";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IVehicleRecordRepository } from "#/application/interfaces/repository/IVehicleRecordRepository";
import { IStorageService } from "#/application/interfaces/services/IStorageService";
import { IPocessApplicationUseCase } from "#/application/interfaces/use-case/admin/application/IProcessApplicationUseCase";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import {
  ApplicationApprovedEvent,
  ApplicationApprovedEventPayload,
  ApplicationError,
  ApplicationErrorMessage,
  ApplicationRejectEvent,
  ApplicationRejectEventPayload,
  ApplicationReturnEvent,
  ApplicationReturnEventPayload,
  ApplicationStatus,
  ApplicationType,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * Implementation for the use case to update application status by the admin.
 * Only applications in PENDING status can be processed.
 * Updates MongoDB records with public URLs upon approval.
 */
export class ProcessApplicationUseCase implements IPocessApplicationUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _vehicleRecordRepository: IVehicleRecordRepository,
    private readonly _storageService: IStorageService,
    private readonly _eventBus: IEventBus,
  ) {}

  /**
   * Updates application status if PENDING and publishes events on status change
   *
   * @param data : Data to process application
   */
  async execute(data: ProcessApplicationRequestDTO): Promise<void> {
    const { applicationId: id, adminComment, applicationStatus } = data;

    const existingApplication =
      await this._applicationRepository.findByCustomId(id);

    if (!existingApplication) {
      throw new ApplicationError(
        ApplicationErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ProcessApplicationUseCase - execute",
          description: ApplicationErrorMessage.NOT_FOUND,
        },
      );
    }

    if (existingApplication.applicationStatus !== ApplicationStatus.PENDING) {
      throw new ApplicationError(
        ApplicationErrorMessage.INVALID_APPLICATION_STATUS,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "ProcessApplicationUseCase - execute",
          description: "Only pending applications can be processed by admin.",
        },
      );
    }

    await this._applicationRepository.updateByCustomId(id, {
      applicationStatus,
      $push: { adminComments: adminComment },
    } as unknown as Partial<ApplicationEntity>);

    const fullApplication =
      await this._applicationRepository.getFullApplicationDetails(id);

    if (!fullApplication) {
      throw new ApplicationError(
        ApplicationErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ProcessApplicationUseCase",
          description: "Application not found after status update",
        },
      );
    }

    // returned event
    if (applicationStatus === ApplicationStatus.RETURNED) {
      const eventPayload: ApplicationReturnEventPayload = {
        applicationId: fullApplication.applicationId,
        applicationType: fullApplication.applicationType,
        userId: fullApplication.userId,
        firstName: fullApplication.firstName,
        lastName: fullApplication.lastName,
        emailId: fullApplication.emailId,
        comment: adminComment.comment,
        status: ApplicationStatus.RETURNED,
      };

      const applicationReturnEvent: ApplicationReturnEvent = {
        eventName: EventName.ADMIN_RETURN_APPLICTION,
        payload: eventPayload,
        timestamp: new Date(),
      };

      await this._eventBus.publish(applicationReturnEvent);
    }

    // rejection event
    if (applicationStatus === ApplicationStatus.REJECTED) {
      const eventPayload: ApplicationRejectEventPayload = {
        applicationId: fullApplication.applicationId,
        applicationType: fullApplication.applicationType,
        userId: fullApplication.userId,
        firstName: fullApplication.firstName,
        lastName: fullApplication.lastName,
        emailId: fullApplication.emailId,
        comment: adminComment.comment,
        status: ApplicationStatus.REJECTED,
      };

      const applicationRejectEvent: ApplicationRejectEvent = {
        eventName: EventName.ADMIN_REJECT_APPLICATION,
        payload: eventPayload,
        timestamp: new Date(),
      };

      await this._eventBus.publish(applicationRejectEvent);
    }

    // approval event
    if (applicationStatus === ApplicationStatus.APPROVED) {
      if (fullApplication.applicationType == ApplicationType.ONBOARDING) {
        await this._userRepository.updateByCustomId(fullApplication.userId, {
          isDriver: true,
        });
      }

      const firstDriver = Array.isArray(fullApplication.driverRecord)
        ? fullApplication.driverRecord[0]
        : fullApplication.driverRecord;

      const firstVehicle = Array.isArray(fullApplication.vehicleRecord)
        ? fullApplication.vehicleRecord[0]
        : fullApplication.vehicleRecord;

      let publicVehicleImage: string | undefined;
      if (firstVehicle?.vehicleImage) {
        publicVehicleImage = firstVehicle.vehicleImage.startsWith("http")
          ? firstVehicle.vehicleImage
          : await this._storageService.getPublicURL(firstVehicle.vehicleImage);

        // Update MongoDB VehicleRecord with the public URL
        await this._vehicleRecordRepository.updateByCustomId(firstVehicle.recordId, {
          vehicleImage: publicVehicleImage,
        });
      }

      let publicLicenseImage: string | undefined;
      if (firstDriver?.licenseFile) {
        publicLicenseImage = firstDriver.licenseFile.startsWith("http")
          ? firstDriver.licenseFile
          : await this._storageService.getPublicURL(firstDriver.licenseFile);
      }

      const eventPayload: ApplicationApprovedEventPayload = {
        applicationId: fullApplication.applicationId,
        applicationType: fullApplication.applicationType,
        userId: fullApplication.userId,
        firstName: fullApplication.firstName,
        lastName: fullApplication.lastName,
        emailId: fullApplication.emailId,
        comment: adminComment.comment,
        status: ApplicationStatus.APPROVED,
        vehicleData: firstVehicle
          ? {
              vehicleRecordId: firstVehicle.recordId,
              vehicleType: firstVehicle.vehicleType,
              vehicleModel: firstVehicle.vehicleModel,
              vehicleMake: firstVehicle.vehicleMake,
              vehicleImage: publicVehicleImage || firstVehicle.vehicleImage,
              registrationNumber: firstVehicle.registrationNumber,
              vehicleCapacity: firstVehicle.vehicleCapacity,
            }
          : undefined,
        driverData: firstDriver
          ? {
              driverRecordId: firstDriver.recordId,
              licenseNumber: firstDriver.licenseNumber,
              licenseImage: publicLicenseImage || firstDriver.licenseFile,
            }
          : undefined,
      };

      const applicationApprovedEvent: ApplicationApprovedEvent = {
        eventName: EventName.ADMIN_APPROVE_APPLICTION,
        payload: eventPayload,
        timestamp: new Date(),
      };

      await this._eventBus.publish(applicationApprovedEvent);
    }
  }
}
