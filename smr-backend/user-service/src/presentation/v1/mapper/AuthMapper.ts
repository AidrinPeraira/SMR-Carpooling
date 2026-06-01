import { SignUpRequestDTO } from "#/application/dto/auth/SignUpRequestDTO";
import { SignUpResultDTO } from "#/application/dto/auth/SignUpResultDTO";
import {
  SignUpRequest,
  SignUpResult,
  SignUpUserSchema,
  zodParser,
} from "@smr/shared";

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
