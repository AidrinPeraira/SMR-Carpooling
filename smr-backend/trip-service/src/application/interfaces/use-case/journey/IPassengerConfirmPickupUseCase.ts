import { PassengerConfirmPickupRequestDTO } from "#/application/dto/journey/PassengerConfirmPickupDTO";

/**
 * This use case confirms that the passenger pickup
 * has been verified and updates the pickup time for
 * the passenger
 */
export interface IPassengerConfirmPickupUseCase {
  execute(
    dto: PassengerConfirmPickupRequestDTO,
    passengerId: string,
  ): Promise<void>;
}
