import { GetCustomerEarningsResponseDTO } from "#/application/dto/customer/GetCustomerEarningsDTO";
import { IGetCustomerEarningsUseCase } from "#/application/interfaces/use-cases/customer/IGetCustomerEarningsUseCase";
import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";

export class GetCustomerEarningsUseCase implements IGetCustomerEarningsUseCase {
  constructor(
    private readonly _transactionRepository: ITransactionRepository,
  ) {}

  async execute(customerId: string): Promise<GetCustomerEarningsResponseDTO> {
    const totalEarnings =
      await this._transactionRepository.getCustomerEarnings(customerId);

    return { totalEarnings };
  }
}
