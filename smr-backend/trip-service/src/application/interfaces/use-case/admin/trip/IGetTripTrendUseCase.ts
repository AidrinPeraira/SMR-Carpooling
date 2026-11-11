import { GetTripTrendResponseDTO } from "#/application/dto/admin/AdminTripsDTO";
import { TrendRange } from "@sharemyride/shared";

export interface IGetTripTrendUseCase {
  execute(range: TrendRange): Promise<GetTripTrendResponseDTO>;
}
