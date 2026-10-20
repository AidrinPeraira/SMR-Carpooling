import { GetRevenueTrendResponseDTO } from "#/application/dto/admin/AdminPaymentsDTO";
import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { IGetRevenueTrendUseCase } from "#/application/interfaces/use-cases/admin/IGetRevenueTrendUseCase";
import { TrendRange } from "@sharemyride/shared";

export class GetRevenueTrendUseCase implements IGetRevenueTrendUseCase {
  constructor(private readonly _transactionRepository: ITransactionRepository) {}

  async execute(range: TrendRange): Promise<GetRevenueTrendResponseDTO> {
    return this._transactionRepository.getRevenueTrend(range);
  }
}
