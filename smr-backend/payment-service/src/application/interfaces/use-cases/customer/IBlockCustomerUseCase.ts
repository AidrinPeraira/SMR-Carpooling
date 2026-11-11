import { CustomerEntity } from "#/domain/entities/CustomerEntity";

/**
 * Use case to block a customer in payment service
 */
export interface IBlockCustomerUseCase {
  execute(customerId: string): Promise<CustomerEntity>;
}
