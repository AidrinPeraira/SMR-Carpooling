import { Request, Response } from "express";
import { IGetAllUsersUseCase } from "#/application/interfaces/use-case/admin/users/IGetAllUsersUseCase";
import { IAdminUserControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminUserControllerV1";
import {
  toGetAllUsersRequestQuery,
  toGetAllUsersResult,
} from "#/presentation/v1/mapper/QueryMapper";
import {
  AccountStatus,
  ApplicationError,
  ErrorCode,
  GenericErrorMessage,
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  UserSuccessMessage,
  zodParser,
  UserIdParamSchema,
  UserIdParamSchemaType,
} from "@smr/shared";
import { IChangeUserStatusUseCase } from "#/application/interfaces/use-case/admin/users/IChangeUserStatusUseCase";
import { IGetFullUserProfileUseCase } from "#/application/interfaces/use-case/admin/users/IGetFullUserProfileUseCase";
import { toGetFullUserProfileResult } from "#/presentation/v1/mapper/admin/AdminUsersMapper";

export class AdminUserControllerV1 implements IAdminUserControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getAllUsersUseCase: IGetAllUsersUseCase,
    private readonly _changeUserStatusUseCase: IChangeUserStatusUseCase,
    private readonly _getFullUserProfileUseCase: IGetFullUserProfileUseCase,
  ) {}

  /**
   * This constroller method takes the user query fields from the request query params
   * and maps into into the shape needed by domain and calls the use case to
   * get all the users that match, and sends it back to the client
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const query = toGetAllUsersRequestQuery(req.query);

    this._logger.info("Fetching all users. Admin: ", {
      adminUserId: req.headers["x-user-id"],
    });

    const result = await this._getAllUsersUseCase.execute(query);

    res.status(HttpStatusCodes.Ok).json(
      makeSuccessResponse(GenericSuccessMessage.OPERATION_SUCCESSFUL, {
        data: result.data.map((user) => toGetAllUsersResult(user)),
        paginationMeta: result.paginationMeta,
      }),
    );
  }

  /**
   * This method gets the user id from request prams
   * validates it using schema parser
   *  and calls the use case to get full user profile details for tha admin
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  async getFullUserProfile(req: Request, res: Response): Promise<void> {
    const { userId } = zodParser<UserIdParamSchemaType>(
      UserIdParamSchema,
      req.params,
    );

    this._logger.info("Fetching full user profile for userId: ", {
      adminUserId: req.headers["x-user-id"],
      userId: userId,
    });

    const result = await this._getFullUserProfileUseCase.execute(userId);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          toGetFullUserProfileResult(result),
        ),
      );
  }

  /**
   * This controller method gets the user id from  request path params and
   * calls the use case to chagne the user status to blocked.
   *
   * @param req - Express request object
   * @param res - Express response object
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
   * This controller method gets the user id from  request path params and
   * calls the use case to chagne the user status to unblocked / active.
   *
   * @param req - Express request object
   * @param res - Express response object
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
