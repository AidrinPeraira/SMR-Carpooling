import * as z from "zod";
import { ImageFileTypes } from "../../enums";

export const GetAvatarUploadUrlSchema = z.object({
  file_type: z.nativeEnum(ImageFileTypes, {
    message:
      "Invalid image file type. Supported types: image/jpg, image/png, image/webp",
  }),
});

export type GetAvatarUploadUrlSchemaType = z.infer<
  typeof GetAvatarUploadUrlSchema
>;
