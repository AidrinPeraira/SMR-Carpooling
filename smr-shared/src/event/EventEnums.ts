export enum EventName {
  AUTH_USER_SIGNUP = "auth.user_signup",
  AUTH_USER_CHANGE_PASSWORD_REQUEST = "auth.user.change_password.request",
  AUTH_USER_CHANGE_PASSWORD_CHANGED = "auth.user.change_password.changed",

  ADMIN_USER_BLOCKED = "admin.users.block_user",
  ADMIN_USER_UNBLOCKED = "admin.users.unblock_user",

  ADMIN_ADD_NEW_VEHICLE = "admin.trip.new_vehicle",
  ADMIN_UPDATE_NEW_VEHICLE = "admin.trip.update_vehicle",

  ADMIN_APPROVE_APPLICTION = "admin.application.approve",
  ADMIN_REJECT_APPLICATION = "admin.application.reject",
  ADMIN_RETURN_APPLICTION = "admin.application.return",

  BOOKING_NEW_BOOKING = "booking.trip.new_booking",
  BOOKING_PAYMENT_SUCCESS = "booking.payment.success",
  BOOKING_PAYMENT_FAILURE = "booking.payment.failure",
  TRIP_CANCELLED_BY_DRIVER = "trip.cancelled_by_driver",
  BOOKING_CANCELLED_BY_PASSENGER = "booking.cancelled_by_passenger",
  TRIP_NEW_TRIP = "trip.new_trip",
}
