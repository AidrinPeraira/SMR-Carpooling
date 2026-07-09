import { Request, Response } from "express";
import { IGetAllUsersUseCase } from "#/application/interfaces/use-case/admin/users/IGetAllUsersUseCase";
import { IAdminUserControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminUserControllerV1";
import { toGetUserResult } from "#/presentation/v1/mapper/ProfileMapper";
import { toGetAllUsersRequestQuery } from "#/presentation/v1/mapper/QueryMapper";
import {
  AccountStatus,
  ApplicationError,
  ErrorCode,
  GenericErrorMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  UserSuccessMessage,
} from "@smr/shared";
import { IChangeUserStatusUseCase } from "#/application/interfaces/use-case/admin/users/IChangeUserStatusUseCase";

export class AdminUserControllerV1 implements IAdminUserControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getAllUsersUseCase: IGetAllUsersUseCase,
    private readonly _changeUserStatusUseCase: IChangeUserStatusUseCase,
  ) {}

  /**
   * take queries. validate it and find all users that match
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const query = toGetAllUsersRequestQuery(req.query);

    this._logger.info("Fetching all users. Admin: ", {
      adminUserId: req.headers["x-user-id"],
    });

    const users = await this._getAllUsersUseCase.execute(query);

    res.status(HttpStatusCodes.Ok).json({
      users: users.map((v) => toGetUserResult(v)),
    });
  }

  /**
   * Blocks a single user
   */
  async blockUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        {
          location: "Admin user controller block user",
          description: "Request has no id in path",
        },
      );
    }

    await this._changeUserStatusUseCase.execute({
      userId: id.toString(),
      status: AccountStatus.BLOCKED,
    });

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(UserSuccessMessage.USER_UPDATED));
  }

  /**
   * Unblock user
   */
  async unBlockUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        {
          location: "Admin user controller block user",
          description: "Request has no id in path",
        },
      );
    }

    await this._changeUserStatusUseCase.execute({
      userId: id.toString(),
      status: AccountStatus.ACTIVE,
    });

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(UserSuccessMessage.USER_UPDATED));
  }
}
