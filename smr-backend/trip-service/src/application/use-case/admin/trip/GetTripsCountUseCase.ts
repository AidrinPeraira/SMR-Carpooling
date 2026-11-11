import { GetTripsCountResposneDTO } from "#/application/dto/admin/AdminTripsDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IGetTripsCountUseCase } from "#/application/interfaces/use-case/admin/trip/IGetTripsCountUseCase";

export class GetTripsCountUseCase implements IGetTripsCountUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  async execute(): Promise<GetTripsCountResposneDTO> {
    return this._tripRepository.getTripsCount();
  }
}
