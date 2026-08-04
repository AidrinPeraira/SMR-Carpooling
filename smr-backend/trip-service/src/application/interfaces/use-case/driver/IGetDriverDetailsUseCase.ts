import { DriverDetailsDTO } from "#/application/dto/driver/DriverDetailsDTO";

export interface IGetDriverDetailsUseCase {
  execute(driverId: string): Promise<DriverDetailsDTO | null>;
}
