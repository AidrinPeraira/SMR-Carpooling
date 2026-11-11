import { GetTransactionsSummaryResponseDTO } from "#/application/dto/admin/AdminPaymentsDTO";

export interface IGetTransactionSummaryUseCase {
  execute(): Promise<GetTransactionsSummaryResponseDTO>;
}
