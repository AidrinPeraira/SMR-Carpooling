import { CustomerEntity } from "#/domain/entities/CustomerEntity";

/**
 * Use case to unblock a customer in payment service
 */
export interface IUnblockCustomerUseCase {
  execute(customerId: string): Promise<CustomerEntity>;
}
