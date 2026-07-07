import {
    deleteProfileImageService,
    updateProfileImageService,
    userProfileService,
} from "./user.service.js";

export const userProfileController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await userProfileService(userId);

        res.status(200).json({
            message: "user profile fetched successfully",
            result,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        });
    }
};

export const updateProfileImageController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await updateProfileImageService(userId, req.file);

        res.status(200).json({
            message: "Profile image updated successfully",
            result,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error",
        });
    }
};

export const deleteProfileImageController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await deleteProfileImageService(userId);

        res.status(200).json({
            message: "Profile image deleted successfully",
            result,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error",
        });
    }
};
