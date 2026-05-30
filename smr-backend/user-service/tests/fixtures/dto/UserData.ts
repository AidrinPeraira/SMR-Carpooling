import { SignUpRequestDTO } from "#/application/dto/auth/SignUpRequestDTO";
import { SignUpResultDTO } from "#/application/dto/auth/SignUpResultDTO";
import { UserRole } from "@smr/shared";
import { MOCK_USER_ID } from "../constants/AuthConstants";

export function createSignupRequestDTO(
  override: Partial<SignUpRequestDTO> = {},
): SignUpRequestDTO {
  const mockSignUpData: SignUpRequestDTO = {
    firstName: "Test",
    lastName: "User",
    emailId: "sample@mail.com",
    phoneNumber: "9879879870",
    password: "123qweASD@",
    confirmPassword: "123qweASD@",
  };

  return {
    ...mockSignUpData,
    ...override,
  };
}

export function createSignUpResultDTO(override: Partial<SignUpResultDTO> = {}) {
  const mockSignupResultData: SignUpResultDTO = {
    userId: MOCK_USER_ID,
    firstName: "Test",
    lastName: "User",
    emailId: "sample@mail.com",
  };

  return {
    ...mockSignupResultData,
    ...override,
  };
}

//fake user data for user repository.
export function createMockUserData(override: any = {}) {
  const now = new Date();

  const mockUserData = {
    userId: MOCK_USER_ID,
    firstName: "Test",
    lastName: "User",
    emailId: "sample@mail.com",
    phoneNumber: "9879879870",
    passwordHash: "hashed_123qweASD@",
    isDriver: false,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  };

  return {
    ...mockUserData,
    ...override,
  };
}
