import express from "express";
import {
    deleteProfileImageController,
    updateProfileImageController,
    userProfileController,
} from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { Upload } from "../../middleware/upload.multer.js";

const router = express.Router();

router.get("/profile/me", authMiddleware, userProfileController);
router.patch("/profile/image", authMiddleware, Upload.single("user_image"), updateProfileImageController);
router.delete("/profile/image", authMiddleware, deleteProfileImageController);

export default router;
