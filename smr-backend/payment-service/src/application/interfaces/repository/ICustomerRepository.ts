import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { CustomerEntity } from "#/domain/entities/CustomerEntity";

/**
 * Repository interface for Customer data in payment service
 */
export interface ICustomerRepository extends IBaseRepository<CustomerEntity> {
  findByCustomerId(customerId: string): Promise<CustomerEntity | null>;
  findByEmail(email: string): Promise<CustomerEntity | null>;
  updateByCustomerId(
    customerId: string,
    data: Partial<CustomerEntity>,
  ): Promise<CustomerEntity>;
}
