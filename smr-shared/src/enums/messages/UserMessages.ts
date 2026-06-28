export enum UserSuccessMessage {
  REGISTERED = "User account created successfully.",
  LOGGED_IN = "Successfully logged in.",
  PROFILE_UPDATED = "Your profile information has been saved.",
  PASSWORD_CHANGED = "Your password has been updated successfully.",
  VERIFICATION_EMAIL_SENT = "A verification link has been sent to your email.",
  TOKEN_REFRESHED = "Tokens refreshed successfully.",
  PASSWORD_RESET_LINK_SENT = "A password reset link has been sent to your email.",
}

export enum UserErrorMessage {
  NOT_FOUND = "No user found with the provided details.",
  EMAIL_ALREADY_EXISTS = "This email address is already registered.",
  INVALID_CREDENTIALS = "The email or password you entered is incorrect.",
  ACCOUNT_SUSPENDED = "Your account has been suspended. Please contact support.",
  UNVERIFIED_EMAIL = "Please verify your email address before continuing.",
  INVALID_TOKEN = "The verification token is invalid or has expired.",
  PASSWORD_MISMATCH = "Passwords do not match.",
}
