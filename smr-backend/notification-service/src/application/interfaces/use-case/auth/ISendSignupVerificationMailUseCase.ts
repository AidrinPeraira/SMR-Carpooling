import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";

export interface ISendSignupVerificationMailUseCase {
  execute(data: SinupVerifcationMailRequestDTO): Promise<void>;
}
