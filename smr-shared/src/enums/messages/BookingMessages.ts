export enum BookingSuccessMessage {
  CREATED = "Booking request submitted successfully.",
  ACCEPTED = "Booking request accepted successfully.",
  REJECTED = "Booking request rejected successfully.",
  CANCELLED = "Booking cancelled successfully.",
}

export enum BookingErrorMessage {
  NOT_FOUND = "The requested booking was not found.",
  TRIP_NOT_FOUND = "The requested trip was not found.",
  CANNOT_BOOK_STATUS = "Trip status does not allow booking.",
  ALREADY_BOOKED = "You already have an active booking for this trip.",
  INSUFFICIENT_SEATS = "Requested seats exceed available vacant seats.",
  DRIVER_CANNOT_BOOK_OWN_TRIP = "Drivers cannot book seats on their own trips.",
  UNAUTHORIZED_DRIVER = "This booking does not belong to your trip.",
  INVALID_STATUS_TRANSITION = "Booking status does not allow this operation.",
}
