import { SignUpRequestDTO } from "#/application/dto/auth/SignUpRequestDTO";
import { SignUpResultDTO } from "#/application/dto/auth/SignUpResultDTO";
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
