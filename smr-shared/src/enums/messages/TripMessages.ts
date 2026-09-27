export enum TripSuccessMessage {
  CREATED = "Trip scheduled successfully.",
  JOINED = "You have successfully joined the trip.",
  CANCELLED = "The trip has been cancelled.",
  COMPLETED = "Trip marked as completed.",
  STARTED = "Trip started successfully.",
}

export enum TripErrorMessage {
  NOT_FOUND = "The requested trip no longer exists.",
  CANNOT_JOIN = "This trip status doesn't allow joining",
  CANNOT_CANCEL = "Trip cannot be cancelled right now",
  TRIP_FULL = "This trip has reached its maximum capacity.",
  ALREADY_JOINED = "You are already a participant in this trip.",
  CANCELLED = "The trip has been cancelled.",
  UNAUTHORIZED_CANCELLATION = "Only the trip creator can cancel this trip.",
  PAST_DATE = "Cannot schedule a trip for a past date.",
  CANNOT_START = "Trip cannot be started right now",
  ALREADY_STARTED = "This trip has already been started.",
  UNAUTHORIZED_START = "Only the trip creator can start this trip.",
  NOT_TRIP_DATE = "A trip can only be started on its scheduled date.",
  NO_ACTIVE_JOURNEY = "You do not have an ongoing trip right now.",
  JOURNEY_NOT_ONGOING = "This trip is no longer ongoing.",
  UNAUTHORIZED_JOURNEY = "Only the trip creator can update this trip.",
  PASSENGER_NOT_IN_JOURNEY = "This passenger is not part of the trip.",
  STOP_NOT_FOUND = "This stop is not part of the trip.",
  TOO_FAR_FROM_STOP = "You are too far from the stop to mark it as reached.",
}
