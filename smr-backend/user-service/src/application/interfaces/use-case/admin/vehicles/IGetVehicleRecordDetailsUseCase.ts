import { AdminVehicleRecordDetailsResult } from "@sharemyride/shared";

export interface IGetVehicleRecordDetailsUseCase {
  execute(recordId: string): Promise<AdminVehicleRecordDetailsResult>;
}
