import { DriverEntity } from "#/domain/entities/DriverEntity";

/**
 * This is the repository that handles the crud operations for driver
 * entity
 */
export interface IDriverRepository {
  save(driver: DriverEntity): Promise<DriverEntity>;
  update(
    driverId: string,
    driver: Partial<DriverEntity>,
  ): Promise<DriverEntity>;
}
