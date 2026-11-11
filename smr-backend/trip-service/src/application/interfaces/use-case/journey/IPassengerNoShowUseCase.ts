import { PassengerNoShowRequestDTO } from "#/application/dto/journey/PassengerNoShowDTO";

/**
 * This use case verifies a minimum of 10 min wait time
 * after driver arrival and marks passenger as now show if needed
 * It also publishes the event to remove live tracking for passenger
 */
export interface IPassengerNoShowUseCase {
  execute(dto: PassengerNoShowRequestDTO): Promise<void>;
}
