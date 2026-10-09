export enum JourneySuccessMessage {
  STARTED = "Trip journey started successfully.",
  DRIVER_DETAILS_FETCHED = "Driver journey details fetched successfully.",
  PASSENGER_DETAILS_FETCHED = "Passenger journey details fetched successfully.",
}

export enum JourneyErrorMessage {
  TRIP_NOT_FOUND = "The requested trip was not found.",
  NOT_TRIP_DRIVER = "You are not the driver of this trip.",
  CANNOT_START = "This trip cannot be started in its current state.",
  NO_CONFIRMED_BOOKINGS = "Cannot start journey without any confirmed bookings.",
  JOURNEY_NOT_FOUND = "The requested journey was not found.",
  NOT_JOURNEY_PASSENGER = "You are not a passenger in this journey.",
  NOT_JOURNEY_DRIVER = "You are not the driver of this journey.",
  JOURNEY_NOT_ACTIVE = "This journey is no longer active.",
  INVALID_SHARE_TOKEN = "The share token is invalid or has been revoked.",
}
