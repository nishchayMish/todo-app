import express from "express";
import {
    deleteProfileImageController,
    updateProfileController,
    updateProfileImageController,
    userProfileController,
    verifyEmailUpdateOTPController,
} from "./user.controller.js";
import {
    sanitizedUpdateProfileInput,
    sanitizedVerifyEmailUpdateInput,
} from "./user.sanitizedInput.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { Upload } from "../../middleware/upload.multer.js";

const router = express.Router();

router.get("/profile/me", authMiddleware, userProfileController);
router.patch("/profile", authMiddleware, sanitizedUpdateProfileInput, updateProfileController);
router.post("/profile/email", authMiddleware, sanitizedVerifyEmailUpdateInput, verifyEmailUpdateOTPController);
router.patch("/profile/image", authMiddleware, Upload.single("user_image"), updateProfileImageController);
router.delete("/profile/image", authMiddleware, deleteProfileImageController);

export default router;
