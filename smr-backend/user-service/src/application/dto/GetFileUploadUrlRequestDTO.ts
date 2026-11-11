import { FileNames, ImageFileTypes } from "@sharemyride/shared";

export interface GetFileUploadUrlRequestDTO {
  userId: string;
  fileType: ImageFileTypes;
  fileName: FileNames;
}
