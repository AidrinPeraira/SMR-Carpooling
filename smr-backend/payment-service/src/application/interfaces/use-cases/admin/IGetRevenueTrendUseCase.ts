import { GetRevenueTrendResponseDTO } from "#/application/dto/admin/AdminPaymentsDTO";
import { TrendRange } from "@sharemyride/shared";

export interface IGetRevenueTrendUseCase {
  execute(range: TrendRange): Promise<GetRevenueTrendResponseDTO>;
}
