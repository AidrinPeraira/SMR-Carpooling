import * as z from "zod";

export const RefreshTokenSchema = z.object({
  refresh_token: z
    .string({ error: "Refresh token is required" })
    .trim(),
});

export type RefreshTokenSchemaType = z.infer<typeof RefreshTokenSchema>;
