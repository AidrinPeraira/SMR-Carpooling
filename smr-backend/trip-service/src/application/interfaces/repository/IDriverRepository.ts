import { DriverEntity } from "#/domain/entities/DriverEntity";

/**
 * Repository interface that handles CRUD operations for driver entity
 */
export interface IDriverRepository {
  save(driver: DriverEntity): Promise<DriverEntity>;
  update(
    driverId: string,
    driver: Partial<DriverEntity>,
  ): Promise<DriverEntity>;
  findByDriverId(driverId: string): Promise<DriverEntity | null>;
}
