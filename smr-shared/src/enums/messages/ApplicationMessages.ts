export enum ApplicationSuccessMessage {
  APPLICATION_SUBMITTED = "Application submitted successfully.",
  APPLICATION_PROCESSED = "Application processed successfully.",
}

export enum ApplicationErrorMessage {
  NOT_FOUND = "Application not found.",
  DRIVER_RECORD_NOT_FOUND = "Driver record not found for renewal. Please submit an onboarding application instead.",
  VEHICLE_RECORD_NOT_FOUND = "Vehicle record not found for renewal. Please add a new vehicle instead.",
  CANNOT_RENEW_VALID_RECORD = "Cannot renew application. Active or valid records already exist.",
  INVALID_APPLICATION_STATUS = "The application status transition is invalid.",
}
