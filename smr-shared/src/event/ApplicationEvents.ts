import { ApplicationStatus, ApplicationType, VehicleTypes } from "../enums";
import { DomainEvent } from "./DomainEvent";

//rejected applications:
export interface ApplicationRejectEventPayload {
  applicationId: string;
  applicationType: ApplicationType;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  comment: string;
  status: ApplicationStatus.REJECTED;
}

export type ApplicationRejectEvent = DomainEvent<ApplicationRejectEventPayload>;

//returned applicatoin
export interface ApplicationReturnEventPayload {
  applicationId: string;
  applicationType: ApplicationType;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  comment: string;
  status: ApplicationStatus.RETURNED;
}

export type ApplicationReturnEvent = DomainEvent<ApplicationReturnEventPayload>;

//approved application
interface VehicleData {
  vehicleRecordId: string;
  vehicleType: VehicleTypes;
  vehicleModel: string;
  vehicleMake: string;
  vehicleImage: string;
  registrationNumber: string;
  vehicleCapacity: number;
}

interface DriverData {
  driverRecordId: string;
  licenseNumber: string;
  licenseImage: string;
}

export interface ApplicationApprovedEventPayload {
  applicationId: string;
  applicationType: ApplicationType;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  comment: string;
  vehicleData?: VehicleData;
  driverData?: DriverData;
  status: ApplicationStatus.APPROVED;
}

export type ApplicationApprovedEvent =
  DomainEvent<ApplicationApprovedEventPayload>;
