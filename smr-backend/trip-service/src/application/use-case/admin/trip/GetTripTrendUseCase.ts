import { GetTripTrendResponseDTO } from "#/application/dto/admin/AdminTripsDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IGetTripTrendUseCase } from "#/application/interfaces/use-case/admin/trip/IGetTripTrendUseCase";
import { TrendRange } from "@sharemyride/shared";

export class GetTripTrendUseCase implements IGetTripTrendUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  async execute(range: TrendRange): Promise<GetTripTrendResponseDTO> {
    return this._tripRepository.getTripTrend(range);
  }
}
