import { GetTripTrendResponseDTO } from "#/application/dto/admin/AdminTripsDTO";

export interface IGetTripTrendUseCase {
  execute(): Promise<GetTripTrendResponseDTO>;
}
