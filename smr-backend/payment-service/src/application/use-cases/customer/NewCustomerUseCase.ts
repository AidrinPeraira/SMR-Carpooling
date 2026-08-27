import { CreateCustomerRequestDTO } from "#/application/dto/customer/CreateCustomerRequestDTO";
import { ICustomerRepository } from "#/application/interfaces/repository/ICustomerRepository";
import { INewCustomerUseCase } from "#/application/interfaces/use-cases/customer/INewCustomerUseCase";
import { CustomerEntity } from "#/domain/entities/CustomerEntity";

export class NewCustomerUseCase implements INewCustomerUseCase {
  constructor(private readonly _customerRepository: ICustomerRepository) {}

  async execute(dto: CreateCustomerRequestDTO): Promise<CustomerEntity> {
    const existing = await this._customerRepository.findByCustomerId(
      dto.customerId,
    );

    if (existing) {
      return this._customerRepository.updateByCustomerId(dto.customerId, {
        firstName: dto.firstName,
        lastName: dto.lastName,
        emailId: dto.emailId,
        updatedAt: new Date(),
      });
    }

    const now = new Date();
    return this._customerRepository.save({
      customerId: dto.customerId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      emailId: dto.emailId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }
}
