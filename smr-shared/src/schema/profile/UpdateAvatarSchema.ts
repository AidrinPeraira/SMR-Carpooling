import * as z from "zod";

export const UpdateAvatarSchema = z.object({
  profile_image: z
    .string({ error: "Profile image path is required" })
    .trim()
    .min(1, { message: "Profile image path cannot be empty" }),
});

export type UpdateAvatarSchemaType = z.infer<typeof UpdateAvatarSchema>;
