import { TripCancellationMailDTO } from "#/application/dto/email/TripCancellationMailDTO";

export interface ISendTripCancellationEmailUseCase {
  execute(data: TripCancellationMailDTO): Promise<void>;
}
