import { Request, Response } from "express";
import { IGetAllVehicleRecordsUseCase } from "#/application/interfaces/use-case/admin/vehicles/IGetAllVehicleRecordsUseCase";
import { IGetVehicleRecordDetailsUseCase } from "#/application/interfaces/use-case/admin/vehicles/IGetVehicleRecordDetailsUseCase";
import { IAdminVehicleRecordControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminVehicleRecordControllerV1";
import { AdminVehicleRecordsMapper } from "#/application/mapper/admin/AdminVehicleRecordsMapper";
import {
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  QueryRequest,
  QuerySchema,
  zodParser,
} from "@sharemyride/shared";
import { Trace } from "#/presentation/utils/traces-decorator";

export class AdminVehicleRecordControllerV1
  implements IAdminVehicleRecordControllerV1
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _getAllVehicleRecordsUseCase: IGetAllVehicleRecordsUseCase,
    private readonly _getVehicleRecordDetailsUseCase: IGetVehicleRecordDetailsUseCase,
  ) {}

  @Trace("admin-vehicle-record-module")
  async getAllVehicleRecords(req: Request, res: Response): Promise<void> {
    const queryParams = zodParser<QueryRequest>(QuerySchema, req.query);
    const query =
      AdminVehicleRecordsMapper.toGetAllVehicleRecordsRequestQuery(queryParams);

    this._logger.info("Fetching all vehicle records. Admin: ", {
      adminUserId: req.headers["x-user-id"],
    });

    const result = await this._getAllVehicleRecordsUseCase.execute(query);

    res.status(HttpStatusCodes.Ok).json(
      makeSuccessResponse(GenericSuccessMessage.OPERATION_SUCCESSFUL, {
        data: result.data.map((record) =>
          AdminVehicleRecordsMapper.toAdminVehicleRecordResult(record),
        ),
        paginationMeta: result.paginationMeta,
      }),
    );
  }

  @Trace("admin-vehicle-record-module")
  async getVehicleRecordDetails(req: Request, res: Response): Promise<void> {
    const recordId = req.params.recordId as string;

    this._logger.info("Fetching vehicle record details. Admin: ", {
      adminUserId: req.headers["x-user-id"],
      recordId,
    });

    const result =
      await this._getVehicleRecordDetailsUseCase.execute(recordId);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          result,
        ),
      );
  }
}
