import { DriverVerifyPickupRequestDTO } from "#/application/dto/trip/ActiveJourneyDTO";

/**
 * This use case verifies the pickup of a passenger using the
 * pickup OTP the passenger shows to the driver.
 */
export interface IDriverVerifyPickupUseCase {
  execute(dto: DriverVerifyPickupRequestDTO): Promise<void>;
}
