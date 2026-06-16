import * as z from "zod";

export const VerifyEmailSchema = z.object({
  verification_token: z
    .string({ error: "Verification token is required" })
    .trim(),
});

export type VerifyEmailSchemaType = z.infer<typeof VerifyEmailSchema>;
