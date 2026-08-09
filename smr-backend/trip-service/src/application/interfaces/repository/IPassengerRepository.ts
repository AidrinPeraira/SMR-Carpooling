import { PassengerEntity } from "#/domain/entities/PassengerEntity";

/**
 * This is the repository for passenger records
 */
export interface IPassengerRepository {
  save(passenger: PassengerEntity): Promise<PassengerEntity>;
  findByPassengerId(passengerId: string): Promise<PassengerEntity | null>;
}
