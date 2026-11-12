import { NewBookingMailDTO } from "#/application/dto/email/NewBookingMailDTO";

export interface ISendNewBookingEmailUseCase {
  execute(data: NewBookingMailDTO): Promise<void>;
}
