import { IGetWalletTransactionsUseCase } from "#/application/interfaces/use-cases/wallet/IGetWalletTransactionDetails";
import { GetWalletTransactionsQueryDTO } from "#/application/dto/wallet/WalletTransactionsDTO";
import { IWalletControllerV1 } from "#/presentation/v1/interfaces/IWalletControllerV1";
import { WalletMapper } from "#/presentation/v1/mapper/WalletMapper";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  QuerySchema,
  QuerySchemaType,
  zodParser,
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
} from "@sharemyride/shared";
import { NextFunction, Request, Response } from "express";

export class WalletControllerV1 implements IWalletControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getWalletTransactionsUseCase: IGetWalletTransactionsUseCase,
  ) {}

  async getWalletTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = zodParser<QuerySchemaType>(QuerySchema, req.query);

      const userId = req.user?.id;
      if (!userId) {
        throw new ApplicationError(
          GenericErrorMessage.UNAUTHORIZED,
          HttpStatusCodes.Unauthorized,
          ErrorCode.SYSTEM_AUTH_ERROR,
          ErrorDetails.UNAUTHORIZED,
        );
      }

      this._logger.info("Fetching wallet transactions", { userId });

      const dto: GetWalletTransactionsQueryDTO = {
        limit: query.limit,
        page: query.page,
        search: query.search,
        searchFields: query.searchFields as any,
        sortField: query.sortField as any,
        sortValue: query.sortValue,
        filterField: query.filterField as any,
        filterValue: query.filterValue,
      };

      const result = await this._getWalletTransactionsUseCase.execute(dto, userId);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Wallet transactions fetched successfully",
            WalletMapper.toGetWalletTransactionsResult(result),
          ),
        );
    } catch (error) {
      next(error);
    }
  }
}
