import { IGetAvatarUploadUrlUseCase } from "#/application/interfaces/use-case/profile/IGetAvatarUploadUrlUseCase";
import { IGetUserUseCase } from "#/application/interfaces/use-case/profile/IGetUserUseCase";
import { IUpdateAvatarUseCase } from "#/application/interfaces/use-case/profile/IUpdateAvatarUseCase";
import { IUpdateUserUseCase } from "#/application/interfaces/use-case/profile/IUpdateUserUseCase";
import { IProfileControllerV1 } from "#/presentation/v1/interfaces/IProfileControllerV1";
import {
  toGetAvatarUploadUrlRequestDTO,
  toGetAvatarUploadUrlResult,
  toGetUserResult,
  toUpdateAvatarRequestDTO,
  toUpdateAvatarResult,
  toUpdateUserRequestDTO,
} from "#/presentation/v1/mapper/ProfileMapper";
import {
  ApplicationError,
  ErrorCode,
  GetAvatarUploadUrlResult,
  GenericErrorMessage,
  GenericSuccessMessage,
  GetUserResult,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  UpdateAvatarResult,
  UserSuccessMessage,
} from "@sharemyride/shared";
import { Request, Response } from "express";

export class ProfileControllerV1 implements IProfileControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getUserUseCase: IGetUserUseCase,
    private readonly _updateUserUseCase: IUpdateUserUseCase,
    private readonly _getAvatarUploadUrlUseCase: IGetAvatarUploadUrlUseCase,
    private readonly _updateAvatarUseCase: IUpdateAvatarUseCase,
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

  /*
   * This method verifies if the user is updating own profile and then calls the updatet profile use case
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    const headerUserId = req.headers["x-user-id"] as string;

    const data = toUpdateUserRequestDTO(req.body);

    //check if user id from auth cookies is the same as the one in body data
    if (headerUserId !== data.userId) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        {
          location: "Profile controller V1 - updateUser",
          description:
            "Authenticated user ID does not match target user ID in request body",
        },
      );
    }

    const result = await this._updateUserUseCase.execute(data);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          UserSuccessMessage.PROFILE_UPDATED,
          toGetUserResult(result),
        ),
      );
  }

  async getAvatarUploadUrl(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;

    const dto = toGetAvatarUploadUrlRequestDTO(req.body, userId);
    const result = await this._getAvatarUploadUrlUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<GetAvatarUploadUrlResult>(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          toGetAvatarUploadUrlResult(result),
        ),
      );
  }

  async updateAvatar(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;

    const dto = toUpdateAvatarRequestDTO(req.body, userId);
    const result = await this._updateAvatarUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<UpdateAvatarResult>(
          UserSuccessMessage.PROFILE_UPDATED,
          toUpdateAvatarResult(result),
        ),
      );
  }
}

