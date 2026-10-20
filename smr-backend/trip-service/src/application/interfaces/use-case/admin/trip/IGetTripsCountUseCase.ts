import { GetTripsCountResposneDTO } from "#/application/dto/admin/AdminTripsDTO";

export interface IGetTripsCountUseCase {
  execute(): Promise<GetTripsCountResposneDTO>;
}
