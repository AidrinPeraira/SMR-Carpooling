import { ProcessApplicationRequestDTO } from "#/application/dto/admin/application/AdminApplicationsDTO";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IPocessApplicationUseCase } from "#/application/interfaces/use-case/admin/application/IProcessApplicationUseCase";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import {
  ApplicationApprovedEvent,
  ApplicationApprovedEventPayload,
  ApplicationRejectEvent,
  ApplicationRejectEventPayload,
  ApplicationReturnEvent,
  ApplicationReturnEventPayload,
  ApplicationStatus,
  ApplicationType,
  EventName,
} from "@sharemyride/shared";

/**
 * This is the implementation for the use case to update application status
 * by the admin. It updates the application status and publishes an event for the
 * trip and notification service
 */
export class ProcessApplicationUseCase implements IPocessApplicationUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  /**
   * This method takes updates applications and publishes events on status change
   * as needed. If an onboarding application is approved it changes the driver status
   * to true in driver repo
   *
   * @param data : Data to proces application
   */
  async execute(data: ProcessApplicationRequestDTO): Promise<void> {
    const { applicationId: id, adminComment, applicationStatus } = data;

    await this._applicationRepository.updateByCustomId(id, {
      applicationStatus,
      $push: { adminComments: adminComment },
    } as unknown as Partial<ApplicationEntity>);

    const fullApplication =
      await this._applicationRepository.getFullApplicationDetails(id);

    //returned event
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

    //rejection eventk
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

    //approval event
    if (applicationStatus === ApplicationStatus.APPROVED) {
      if (fullApplication.applicationType == ApplicationType.ONBOARDING) {
        await this._userRepository.updateByCustomId(fullApplication.userId, {
          isDriver: true,
        });
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
        vehicleData: fullApplication.vehicleRecord
          ? {
              vehicleRecordId: fullApplication.vehicleRecord.recordId,
              vehicleType: fullApplication.vehicleRecord.vehicleType,
              vehicleModel: fullApplication.vehicleRecord.vehicleModel,
              vehicleMake: fullApplication.vehicleRecord.vehicleMake,
              vehicleImage: fullApplication.vehicleRecord.vehicleImage,
              registrationNumber:
                fullApplication.vehicleRecord.registrationNumber,
              vehicleCapacity: fullApplication.vehicleRecord.vehicleCapacity,
            }
          : undefined,
        driverData: fullApplication.driverRecord
          ? {
              driverRecordId: fullApplication.driverRecord.recordId,
              licenseNumber: fullApplication.driverRecord.licenseNumber,
              licenseImage: fullApplication.driverRecord.licenseFile,
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
