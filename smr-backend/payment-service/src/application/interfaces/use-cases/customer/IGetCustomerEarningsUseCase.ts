import { GetCustomerEarningsResponseDTO } from "#/application/dto/customer/GetCustomerEarningsDTO";

/**
 * This use case finds the total amount earned by customers
 */
export interface IGetCustomerEarningsUseCase {
  execute(customerId: string): Promise<GetCustomerEarningsResponseDTO>;
}
