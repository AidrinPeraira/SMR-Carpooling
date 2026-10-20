import { GetTransactionsSummaryResponseDTO } from "#/application/dto/admin/AdminPaymentsDTO";
import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { IGetTransactionSummaryUseCase } from "#/application/interfaces/use-cases/admin/IGetTransactionSummaryUseCase";

export class GetTransactionSummaryUseCase implements IGetTransactionSummaryUseCase {
  constructor(private readonly _transactionRepository: ITransactionRepository) {}

  async execute(): Promise<GetTransactionsSummaryResponseDTO> {
    return this._transactionRepository.getTransactionsSummary();
  }
}
