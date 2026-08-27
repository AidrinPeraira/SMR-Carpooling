import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { TransactionEntity } from "#/domain/entities/TransactionEntity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {}
