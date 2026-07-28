export enum EventName {
  AUTH_USER_SIGNUP = "auth.user_signup",
  AUTH_USER_CHANGE_PASSWORD_REQUEST = "auth.user.change_password.request",
  AUTH_USER_CHANGE_PASSWORD_CHANGED = "auth.user.change_password.changed",

  ADMIN_USER_BLOCKED = "admin.users.block_user",
  ADMIN_USER_UNBLOCKED = "admin.users.unblock_user",

  ADMIN_ADD_NEW_VEHICLE = "admin.trip.new_vehicle",
  ADMIN_UPDATE_NEW_VEHICLE = "admin.trip.update_vehicle",
}
