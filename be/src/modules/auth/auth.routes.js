import express from "express";
import { santitizedLoginUserInput, santitizedRegisterUserInput, santitizedResendOtpInput, santitizedVerifyUserInput } from "./auth.sanitizedInput.js";
import { loginUserController, refreshTokenController, registerUserController, resendOtpController, verifyUserController } from "./auth.controller.js";

const router = express.Router();

router.post("/register", santitizedRegisterUserInput, registerUserController);
router.post("/verify-user", santitizedVerifyUserInput, verifyUserController);
router.post("/resend-otp", santitizedResendOtpInput, resendOtpController);
router.post("/login", santitizedLoginUserInput, loginUserController);
router.post("/refresh-token", refreshTokenController);

export default router;