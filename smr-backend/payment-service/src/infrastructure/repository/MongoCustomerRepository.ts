import { ICustomerRepository } from "#/application/interfaces/repository/ICustomerRepository";
import { CustomerEntity } from "#/domain/entities/CustomerEntity";
import {
  CustomerDoc,
  CustomerModel,
} from "#/infrastructure/database/models/MongoCustomerModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";

export class MongoCustomerRepository
  extends MongoBaseRepository<CustomerEntity, CustomerDoc>
  implements ICustomerRepository
{
  constructor() {
    super("customerId", CustomerModel);
  }

  protected toDomainEntityMapper(data: CustomerDoc): CustomerEntity {
    return {
      id: data._id.toString(),
      customerId: data.customerId,
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findByCustomerId(customerId: string): Promise<CustomerEntity | null> {
    return this.findByCustomId(customerId);
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const doc = await this.model.findOne({ emailId: email }).lean();
    return doc ? this.toDomainEntityMapper(doc) : null;
  }

  async updateByCustomerId(
    customerId: string,
    data: Partial<CustomerEntity>,
  ): Promise<CustomerEntity> {
    return this.updateByCustomId(customerId, data);
  }
}
