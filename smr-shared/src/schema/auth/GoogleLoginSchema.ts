import * as z from "zod";

export const GoogleLoginSchema = z.object({
  auth_token: z
    .string({ error: "Google authentication token is required" })
    .trim(),
});

export type GoogleLoginSchemaType = z.infer<typeof GoogleLoginSchema>;
