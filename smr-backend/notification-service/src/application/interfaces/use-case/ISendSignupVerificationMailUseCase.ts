import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";

/**
 * Use Case interface for sending signup verification emails
 * It gets that mapped data fropm the event consumer
 * It should create a notification object and call the mail service
 */
export interface ISendSignupVerificationMailUseCase {
  execute(data: SinupVerifcationMailRequestDTO): Promise<void>;
}
