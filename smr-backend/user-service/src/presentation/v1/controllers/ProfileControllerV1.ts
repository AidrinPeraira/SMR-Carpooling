import { IGetUserUseCase } from "#/application/interfaces/use-case/profile/IGetUserUseCase";
import { IProfileControllerV1 } from "#/presentation/v1/interfaces/IProfileControllerV1";
import { toGetUserResult } from "#/presentation/v1/mapper/ProfileMapper";
import {
  GenericSuccessMessage,
  GetUserResult,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
} from "@smr/shared";
import { Request, Response } from "express";

export class ProfileControllerV1 implements IProfileControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getUserUseCase: IGetUserUseCase,
  ) {}

  async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;

    this._logger.info("Getting user data for ID: ", userId);

    const result = await this._getUserUseCase.execute(userId);
    const mappedResult = toGetUserResult(result);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<GetUserResult>(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          mappedResult,
        ),
      );
  }
}
