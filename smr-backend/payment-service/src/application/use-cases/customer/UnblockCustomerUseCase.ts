import { ICustomerRepository } from "#/application/interfaces/repository/ICustomerRepository";
import { IUnblockCustomerUseCase } from "#/application/interfaces/use-cases/customer/IUnblockCustomerUseCase";
import { CustomerEntity } from "#/domain/entities/CustomerEntity";

export class UnblockCustomerUseCase implements IUnblockCustomerUseCase {
  constructor(private readonly _customerRepository: ICustomerRepository) {}

  async execute(customerId: string): Promise<CustomerEntity> {
    return this._customerRepository.updateByCustomerId(customerId, {
      isActive: true,
      updatedAt: new Date(),
    });
  }
}
