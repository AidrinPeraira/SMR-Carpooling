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
  SignUpRequest,
  SignUpResult,
  VerifyEmailRequest,
  GoogleLoginRequest,
  RefreshTokenRequest,
  RefreshTokenResult,
  ForgotPasswordRequest,
  ChangePasswordRequest,
} from "@sharemyride/shared";
import {
  GeneratePasswordChangeTokenRequestDTO,
  PasswordChangeRequestDTO,
} from "#/application/dto/auth/PasswordChangeDTO";

export class AuthMapper {
  static toSignUpDTO(data: SignUpRequest): SignUpRequestDTO {
    return {
      firstName: data.first_name,
      lastName: data.last_name,
      emailId: data.email_id,
      phoneNumber: data.phone_number,
      password: data.password,
      confirmPassword: data.confirm_password,
    };
  }

  static toSignUpResult(data: SignUpResultDTO): SignUpResult {
    return {
      first_name: data.firstName,
      last_name: data.lastName,
      email_id: data.emailId,
      user_id: data.userId,
    };
  }

  static toLoginDTO(data: LoginRequest): LoginUserRequestDTO {
    return {
      emailId: data.email_id,
      password: data.password,
    };
  }

  static toLoginResult(data: LoginUserResultDTO): LoginResult {
    return {
      user: {
        first_name: data.user.firstName,
        last_name: data.user.lastName,
        email_id: data.user.emailId,
        user_role: data.user.userRole,
        user_id: data.user.userId,
        phone_number: data.user.phoneNumber,
        is_driver: data.user.isDriver,
        created_at: data.user.createdAt.toISOString(),
        profile_image: data.user.profileImage,
      },
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
    };
  }

  static toVerifyEmailDTO(data: VerifyEmailRequest): VerifySignupEmailRequestDTO {
    return {
      verificationToken: data.verification_token,
    };
  }

  static toGoogleLoginDTO(data: GoogleLoginRequest): string {
    return data.auth_token;
  }

  static toRefreshTokenDTO(data: RefreshTokenRequest): RefreshTokenRequestDTO {
    return {
      refreshToken: data.refresh_token,
    };
  }

  static toRefreshTokenResult(data: RefreshTokenResultDTO): RefreshTokenResult {
    return {
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
    };
  }

  static toForgotPasswordDTO(
    data: ForgotPasswordRequest,
  ): GeneratePasswordChangeTokenRequestDTO {
    return {
      emailId: data.email_id,
    };
  }

  static toChangePasswordDTO(data: ChangePasswordRequest): PasswordChangeRequestDTO {
    return {
      emailId: data.email_id,
      password: data.password,
      confimPassword: data.confirm_password,
      token: data.token,
    };
  }
}
