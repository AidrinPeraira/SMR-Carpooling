import {
  GetWalletTransactionsQueryDTO,
  GetWalletTransactionsResponseDTO,
} from "#/application/dto/wallet/WalletTransactionsDTO";

/**
 * This use case gets a paginated result of the
 * wallet transactions connected with a given user
 */
export interface IGetWalletTransactionsUseCase {
  execute(
    dto: GetWalletTransactionsQueryDTO,
    userId: string,
  ): Promise<GetWalletTransactionsResponseDTO>;
}
