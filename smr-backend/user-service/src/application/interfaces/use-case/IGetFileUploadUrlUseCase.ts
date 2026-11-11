import { GetFileUploadUrlRequestDTO } from "#/application/dto/GetFileUploadUrlRequestDTO";
import { GetFileUploadUrlResponseDTO } from "#/application/dto/GetFileUploadUrlResponseDTO";

/**
 * This use case gets the file name and file type and creates a new
 * signed url for file upload
 *
 * the path to upload is temp/user-files/<userId>/<filenaem>-<currentTimeMillisecond>.<fileExtension>
 */
export interface IGetFileUploadUrlUseCase {
  execute(
    data: GetFileUploadUrlRequestDTO,
  ): Promise<GetFileUploadUrlResponseDTO>;
}
