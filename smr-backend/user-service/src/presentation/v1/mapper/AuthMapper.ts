import { LoginUserRequestDTO } from "#/application/dto/auth/LoginUserRequestDTO";
import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";
import { RefreshTokenRequestDTO } from "#/application/dto/auth/RefreshTokenRequestDTO";
import { RefreshTokenResultDTO } from "#/application/dto/auth/RefreshTokenResultDTO";
import { SignUpRequestDTO } from "#/application/dto/auth/SignUpRequestDTO";
import { SignUpResultDTO } from "#/application/dto/auth/SignUpResultDTO";
import { VerifySignupEmailRequestDTO } from "#/application/dto/auth/VerifySignupEmailRequestDTO";
import {
  LoginRequest,
  LoginResult,
  LoginUserSchema,
  SignUpRequest,
  SignUpResult,
  SignUpUserSchema,
  VerifyEmailRequest,
  VerifyEmailSchema,
  GoogleLoginRequest,
  GoogleLoginSchema,
  RefreshTokenRequest,
  RefreshTokenResult,
  RefreshTokenSchema,
  zodParser,
  ForgotPasswordRequest,
  ForgotPasswordSchema,
  ChangePasswordRequest,
  ChangePasswordSchema,
} from "@smr/shared";
import {
  GeneratePasswordChangeTokenRequestDTO,
  PasswordChangeRequestDTO,
} from "#/application/dto/auth/PasswordChangeDTO";

/**
 * This fuction takes data from req,
 * validates it using zod
 * throws and error if invalid,
 * if valid it maps the data to domain shape and returns.
 *
 * @param data : User data from req body,
 * @returns Validated user data as SignUp DTO
 */
export function toSignUpDTO(data: unknown): SignUpRequestDTO {
  const validated = zodParser<SignUpRequest>(SignUpUserSchema, data);
  return {
    firstName: validated.first_name,
    lastName: validated.last_name,
    emailId: validated.email_id,
    phoneNumber: validated.phone_number,
    password: validated.password,
    confirmPassword: validated.confirm_password,
  };
}

/**
 * This fucntion takes the sign up result (returned from use case) and maps it for the client.
 *
 * @param data : SignUp Result from use case,
 * @return SignUp data for client
 */
export function toSignUpResult(data: SignUpResultDTO): SignUpResult {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email_id: data.emailId,
    user_id: data.userId,
  };
}

/**
 * Maps login request data to LoginUserRequestDTO.
 */
export function toLoginDTO(data: unknown): LoginUserRequestDTO {
  const validated = zodParser<LoginRequest>(LoginUserSchema, data);
  return {
    emailId: validated.email_id,
    password: validated.password,
  };
}

/**
 * Maps LoginUserResultDTO to LoginResult for client response.
 */
export function toLoginResult(data: LoginUserResultDTO): LoginResult {
  return {
    user: {
      first_name: data.user.firstName,
      last_name: data.user.lastName,
      email_id: data.user.emailId,
      user_role: data.user.userRole,
      user_id: data.user.userId,
      profile_image: data.user.profileImage,
    },
    access_token: data.accessToken,
    refresh_token: data.refreshToken,
  };
}

/**
 * Maps verification request data to VerifySignupEmailRequestDTO.
 */
export function toVerifyEmailDTO(data: unknown): VerifySignupEmailRequestDTO {
  const validated = zodParser<VerifyEmailRequest>(VerifyEmailSchema, data);
  return {
    verificationToken: validated.verification_token,
  };
}

/**
 * Maps Google login request data to a token string.
 */
export function toGoogleLoginDTO(data: unknown): string {
  const validated = zodParser<GoogleLoginRequest>(GoogleLoginSchema, data);
  return validated.auth_token;
}

/**
 * Maps refresh token request data to RefreshTokenRequestDTO.
 */
export function toRefreshTokenDTO(data: unknown): RefreshTokenRequestDTO {
  const validated = zodParser<RefreshTokenRequest>(RefreshTokenSchema, data);
  return {
    refreshToken: validated.refresh_token,
  };
}

/**
 * Maps RefreshTokenResultDTO to RefreshTokenResult for client response.
 */
export function toRefreshTokenResult(data: RefreshTokenResultDTO): RefreshTokenResult {
  return {
    access_token: data.accessToken,
    refresh_token: data.refreshToken,
  };
}

export function toForgotPasswordDTO(
  data: unknown,
): GeneratePasswordChangeTokenRequestDTO {
  const validated = zodParser<ForgotPasswordRequest>(ForgotPasswordSchema, data);
  return {
    emailId: validated.email_id,
  };
}

export function toChangePasswordDTO(data: unknown): PasswordChangeRequestDTO {
  const validated = zodParser<ChangePasswordRequest>(ChangePasswordSchema, data);
  return {
    emailId: validated.email_id,
    password: validated.password,
    confimPassword: validated.confirm_password,
    token: validated.token,
  };
}
