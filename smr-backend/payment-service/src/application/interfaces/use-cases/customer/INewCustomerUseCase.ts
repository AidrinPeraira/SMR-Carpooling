import { CreateCustomerRequestDTO } from "#/application/dto/customer/CreateCustomerRequestDTO";
import { CustomerEntity } from "#/domain/entities/CustomerEntity";

/**
 * This use case creates a new record for customers
 * for the payment service
 */
export interface INewCustomerUseCase {
  execute(dto: CreateCustomerRequestDTO): Promise<CustomerEntity>;
}
