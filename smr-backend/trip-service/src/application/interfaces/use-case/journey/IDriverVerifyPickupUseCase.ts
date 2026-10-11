import { DriverVerifyPickupRequestDTO } from "#/application/dto/journey/DriverVerifyPickupDTO";

/**
 * This use cases verifies the otp from passenger
 * passed on by driver to confirm pickup
 */
export interface IDriverVerifyPickupUseCase {
  execute(dto: DriverVerifyPickupRequestDTO, driverId: string): Promise<void>;
}
