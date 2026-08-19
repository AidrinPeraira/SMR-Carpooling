import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { TransactionEntity } from "#/domain/entities/TransactionEntity";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {}
