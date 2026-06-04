import * as z from "zod";

export const LoginUserSchema = z.object({
  email_id: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" }),

  password: z.string({ error: "Password is required" }).trim(),
});

export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;
