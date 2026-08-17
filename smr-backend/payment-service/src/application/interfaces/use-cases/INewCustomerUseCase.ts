/**
 * This use case creates a new record for customers
 * for the trip service
 */
export interface INewCustomerUseCase {
  execute(): Promise<void>;
}
