import { z } from "zod";
import { validate } from "../../middleware/validate.middleware.js";

const emailSchema = z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email format");

const updateProfileSchema = z.object({
    body: z
        .object({
            username: z
                .string()
                .trim()
                .min(6, "Username must be at least 6 characters long")
                .optional(),
            email: emailSchema.optional(),
            currentPassword: z.string().optional(),
            newPassword: z
                .string()
                .min(6, "Password must be at least 6 characters long")
                .optional(),
        })
        .superRefine((data, ctx) => {
            const isUsernameUpdate = data.username !== undefined;
            const isEmailUpdate = data.email !== undefined;
            const isPasswordUpdate =
                data.currentPassword !== undefined ||
                data.newPassword !== undefined;

            const updateCount = [
                isUsernameUpdate,
                isEmailUpdate,
                isPasswordUpdate,
            ].filter(Boolean).length;

            if (updateCount === 0) {
                ctx.addIssue({
                    code: "custom",
                    message: "Send username, email, or password to update",
                });
            }

            if (updateCount > 1) {
                ctx.addIssue({
                    code: "custom",
                    message: "Update only one field at a time",
                });
            }

            if (isPasswordUpdate) {
                if (!data.currentPassword) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Current password is required",
                        path: ["currentPassword"],
                    });
                }
                if (!data.newPassword) {
                    ctx.addIssue({
                        code: "custom",
                        message: "New password is required",
                        path: ["newPassword"],
                    });
                }
            }
        }),
});

const verifyEmailUpdateSchema = z.object({
    body: z.object({
        newEmail: emailSchema,
        otp: z
            .string({ error: "OTP is required" })
            .trim()
            .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
    }),
});

export const sanitizedUpdateProfileInput = validate(updateProfileSchema);
export const sanitizedVerifyEmailUpdateInput = validate(verifyEmailUpdateSchema);
