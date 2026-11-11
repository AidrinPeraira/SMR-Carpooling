export enum TripSuccessMessage {
  CREATED = "Trip scheduled successfully.",
  JOINED = "You have successfully joined the trip.",
  CANCELLED = "The trip has been cancelled.",
  COMPLETED = "Trip marked as completed.",
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
}
