import * as z from "zod";

export const ForgotPasswordSchema = z.object({
  email_id: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" }),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
