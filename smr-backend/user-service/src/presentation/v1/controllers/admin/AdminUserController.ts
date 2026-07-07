import { Request, Response } from "express";
import { IGetAllUsersUseCase } from "#/application/interfaces/use-case/profile/IGetAllUsersUseCase";
import { IAdminUserControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminUserControllerV1";
import { toGetUserResult } from "#/presentation/v1/mapper/ProfileMapper";
import { toGetAllUsersRequestQuery } from "#/presentation/v1/mapper/QueryMapper";
import { HttpStatusCodes, ILogger } from "@smr/shared";

export class AdminUserControllerV1 implements IAdminUserControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getAllUsersUseCase: IGetAllUsersUseCase,
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
}
