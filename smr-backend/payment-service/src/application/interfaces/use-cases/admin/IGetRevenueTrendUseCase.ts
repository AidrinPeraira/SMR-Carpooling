import { GetRevenueTrendResponseDTO } from "#/application/dto/admin/AdminPaymentsDTO";

export interface IGetRevenueTrendUseCase {
  execute(): Promise<GetRevenueTrendResponseDTO>;
}
