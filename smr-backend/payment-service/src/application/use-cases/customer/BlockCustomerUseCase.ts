import { ICustomerRepository } from "#/application/interfaces/repository/ICustomerRepository";
import { IBlockCustomerUseCase } from "#/application/interfaces/use-cases/customer/IBlockCustomerUseCase";
import { CustomerEntity } from "#/domain/entities/CustomerEntity";

export class BlockCustomerUseCase implements IBlockCustomerUseCase {
  constructor(private readonly _customerRepository: ICustomerRepository) {}

  async execute(customerId: string): Promise<CustomerEntity> {
    return this._customerRepository.updateByCustomerId(customerId, {
      isActive: false,
      updatedAt: new Date(),
    });
  }
}
