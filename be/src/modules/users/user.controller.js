import {
    deleteProfileImageService,
    resendEmailOtpService,
    updateProfileImageService,
    updateProfileService,
    userProfileService,
    verifyEmailUpdateOTPService,
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

export const updateProfileController = async (req, res) => {
    try {
        const { email, username, currentPassword, newPassword } = req.body;
        const userId = req.user.userId;
        const result = await updateProfileService(
            userId,
            email,
            username,
            currentPassword,
            newPassword
        );

        res.status(200).json({
            message: "Profile updated successfully",
            result,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error",
        });
    }
};

export const verifyEmailUpdateOTPController = async (req, res) => {
    try {
        const { newEmail, otp } = req.body;
        const userId = req.user.userId;
        const result = await verifyEmailUpdateOTPService(userId, newEmail, otp);

        res.status(200).json({
            message: "Email updated successfully",
            result,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        });
    }
};

export const resendEmailOtpController = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.user.userId;
        const result = await resendEmailOtpService(userId, newEmail);

        res.status(200).json({
            message: "Email OTP resent successfully",
            result,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
        });
    }
};