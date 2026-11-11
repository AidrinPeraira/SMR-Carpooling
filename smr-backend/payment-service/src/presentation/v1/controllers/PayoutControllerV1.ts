import { IAdminGetPayoutDetailsUseCase } from "#/application/interfaces/use-cases/payout/IAdminGetPayoutDetailsUseCase";
import { IAdminListPayoutsUseCase } from "#/application/interfaces/use-cases/payout/IAdminListPayoutsUseCase";
import { IApprovePayoutUseCase } from "#/application/interfaces/use-cases/payout/IApprovePayoutUseCase";
import { IGetDriverPayoutsUseCase } from "#/application/interfaces/use-cases/payout/IGetDriverPayoutsUseCase";
import { PayoutMapper } from "#/application/mapper/PayoutMapper";
import { Trace } from "#/presentation/utils/decorators/traces-decorator";
import { IPayoutControllerV1 } from "#/presentation/v1/interfaces/IPayoutControllerV1";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  PayoutSuccessMessage,
  QuerySchema,
  QuerySchemaType,
  zodParser,
} from "@sharemyride/shared";
import { NextFunction, Request, Response } from "express";

export class PayoutControllerV1 implements IPayoutControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getDriverPayoutsUseCase: IGetDriverPayoutsUseCase,
    private readonly _adminListPayoutsUseCase: IAdminListPayoutsUseCase,
    private readonly _adminGetPayoutDetailsUseCase: IAdminGetPayoutDetailsUseCase,
    private readonly _approvePayoutUseCase: IApprovePayoutUseCase,
  ) {}

  @Trace("payout-module")
  async getDriverPayouts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = zodParser<QuerySchemaType>(QuerySchema, req.query);

      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        throw new ApplicationError(
          GenericErrorMessage.UNAUTHORIZED,
          HttpStatusCodes.Unauthorized,
          ErrorCode.INPUT_UNAUTHORIZED,
          ErrorDetails.INPUT_UNAUTHORIZED,
        );
      }

      this._logger.info("Fetching driver payouts", { userId });

      const result = await this._getDriverPayoutsUseCase.execute(userId, {
        limit: query.limit,
        page: query.page,
        search: query.search,
        searchFields: query.searchFields as any,
        sortField: query.sortField as any,
        sortValue: query.sortValue,
        filterField: query.filterField as any,
        filterValue: query.filterValue,
      });

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            PayoutSuccessMessage.PAYOUTS_FETCHED,
            { payouts: PayoutMapper.toPayoutList(result) },
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  @Trace("payout-module")
  async adminListPayouts(req: Request, res: Response): Promise<void> {
    const query = zodParser<QuerySchemaType>(QuerySchema, req.query);

    this._logger.info("Admin: fetching all payouts", {
      page: query.page,
      limit: query.limit,
      filterField: query.filterField,
    });

    const result = await this._adminListPayoutsUseCase.execute({
      limit: query.limit,
      page: query.page,
      search: query.search,
      searchFields: query.searchFields as any,
      sortField: query.sortField as any,
      sortValue: query.sortValue,
      filterField: query.filterField as any,
      filterValue: query.filterValue,
    });

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          PayoutSuccessMessage.PAYOUTS_FETCHED,
          { payouts: PayoutMapper.toPayoutList(result) },
        ),
      );
  }

  @Trace("payout-module")
  async adminGetPayoutDetails(req: Request, res: Response): Promise<void> {
    const payoutId = req.params.payoutId as string;

    this._logger.info("Admin: fetching payout details", { payoutId });

    const result = await this._adminGetPayoutDetailsUseCase.execute(payoutId);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          PayoutSuccessMessage.PAYOUTS_FETCHED,
          { payout: PayoutMapper.toPayoutItem(result) },
        ),
      );
  }

  @Trace("payout-module")
  async adminApprovePayout(req: Request, res: Response): Promise<void> {
    const payoutId = req.params.payoutId as string;

    this._logger.info("Admin: approving payout", { payoutId });

    await this._approvePayoutUseCase.execute(payoutId);

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(PayoutSuccessMessage.PAYOUT_COMPLETED));
  }
}
