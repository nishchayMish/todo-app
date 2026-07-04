import { z } from "zod";
import { validate } from "../../middleware/validate.middleware.js";

const emailSchema = z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email format");

const registerSchema = z.object({
    body: z.object({
        username: z
            .string({ error: "Username is required" })
            .trim()
            .min(6, "Username must be at least 6 characters long"),
        email: emailSchema,
        password: z
            .string({ error: "Password is required" })
            .min(6, "Password must be at least 6 characters long"),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string({ error: "Password is required" }),
    }),
});

const verifySchema = z.object({
    body: z.object({
        email: emailSchema,
        otp: z
            .string({ error: "OTP is required" })
            .trim()
            .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
    }),
});

const resendOtpSchema = z.object({
    body: z.object({
        email: emailSchema,
    }),
});

export const santitizedRegisterUserInput = validate(registerSchema);
export const santitizedLoginUserInput = validate(loginSchema);
export const santitizedVerifyUserInput = validate(verifySchema);
export const santitizedResendOtpInput = validate(resendOtpSchema);
