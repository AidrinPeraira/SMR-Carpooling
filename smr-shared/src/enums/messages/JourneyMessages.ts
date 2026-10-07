export enum JourneySuccessMessage {
  STARTED = "Trip journey started successfully.",
}

export enum JourneyErrorMessage {
  TRIP_NOT_FOUND = "The requested trip was not found.",
  NOT_TRIP_DRIVER = "You are not the driver of this trip.",
  CANNOT_START = "This trip cannot be started in its current state.",
  NO_CONFIRMED_BOOKINGS = "Cannot start journey without any confirmed bookings.",
}
