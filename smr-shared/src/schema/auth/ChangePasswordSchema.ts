import * as z from "zod";

export const ChangePasswordSchema = z
  .object({
    email_id: z.email({ message: "Invalid email format" }).toLowerCase(),

    password: z
      .string({ error: "Password is required" })
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
      .regex(/[0-9]/, { message: "Password must include a number" })
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, {
        message: "Password must include a special character",
      })
      .regex(/^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/, {
        message: "Password contains invalid characters",
      }),

    confirm_password: z
      .string({ error: "Please confirm your password" })
      .trim(),

    token: z.string({ error: "Verification token is required" }).trim(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
