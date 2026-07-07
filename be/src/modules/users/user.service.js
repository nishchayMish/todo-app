import { DeleteImageFromCloudinary, UploadOnCloudinary } from "../../config/cloudinary.js";
import { getOTP, sendOTPForEmailVerification } from "../../utils/helpers.js";
import {
    clearProfileImage,
    deleteOTPsByUserId,
    findOTP,
    findUserByEmail,
    findUserById,
    insertOTP,
    updateProfile,
    updateProfileImage,
    userProfile,
} from "./user.repository.js";
import bcrypt from "bcrypt";

export const userProfileService = async (userId) => {
    if (!userId) {
        throw {
            statusCode: 400,
            message: "userId is required",
        };
    }

    const res = await userProfile(userId);

    if (!res) {
        throw {
            statusCode: 404,
            message: "User not found",
        };
    }

    return res;
};

export const updateProfileImageService = async (userId, file) => {
    if (!userId) {
        throw {
            statusCode: 400,
            message: "userId is required",
        };
    }

    if (!file) {
        throw {
            statusCode: 400,
            message: "Profile image is required",
        };
    }

    const user = await findUserById(userId);

    if (!user) {
        throw {
            statusCode: 404,
            message: "User not found",
        };
    }

    const uploadedImage = await UploadOnCloudinary(file.path);

    if (!uploadedImage?.secure_url) {
        throw {
            statusCode: 500,
            message: uploadedImage?.message || "Failed to upload image",
        };
    }

    if (user.cloudinary_public_id) {
        await DeleteImageFromCloudinary(user.cloudinary_public_id);
    }

    return updateProfileImage(
        userId,
        uploadedImage.secure_url,
        uploadedImage.public_id
    );
};

export const deleteProfileImageService = async (userId) => {
    if (!userId) {
        throw {
            statusCode: 400,
            message: "userId is required",
        };
    }

    const user = await findUserById(userId);

    if (!user) {
        throw {
            statusCode: 404,
            message: "User not found",
        };
    }

    if (!user.cloudinary_public_id) {
        throw {
            statusCode: 400,
            message: "No profile image to delete",
        };
    }

    const deletedImage = await DeleteImageFromCloudinary(user.cloudinary_public_id);

    if (deletedImage?.result !== "ok") {
        throw {
            statusCode: 500,
            message: deletedImage?.message || "Failed to delete image",
        };
    }

    return clearProfileImage(userId);
};

export const updateProfileService = async (
    userId,
    email,
    username,
    currentPassword,
    newPassword
) => {
    if (!userId) {
        throw {
            statusCode: 400,
            message: "userId is required",
        };
    }

    const user = await findUserById(userId);

    if (!user) {
        throw {
            statusCode: 404,
            message: "User not found",
        };
    }

    if (username) {
        const updatedUser = await updateProfile(userId, null, username, null);
        return {
            message: "Username updated successfully",
            user: updatedUser,
        };
    }

    if (currentPassword && newPassword) {
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isPasswordCorrect) {
            throw {
                statusCode: 400,
                message: "Invalid current password",
            };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateProfile(userId, null, null, hashedPassword);
        return {
            message: "Password updated successfully",
        };
    }

    if (email) {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await findUserByEmail(normalizedEmail);

        if (existingUser) {
            throw {
                statusCode: 400,
                message: "Email already in use",
            };
        }

        if (normalizedEmail === user.email) {
            throw {
                statusCode: 400,
                message: "New email is same as current email",
            };
        }


        const otp = getOTP();
        await insertOTP(userId, otp, "email_update");
        await sendOTPForEmailVerification(normalizedEmail, otp);
        return {
            message: "OTP sent to your new email address",
        };
    }
};

export const verifyEmailUpdateOTPService = async (userId, newEmail, otp) => {
    if (!userId) {
        throw {
            statusCode: 400,
            message: "userId is required",
        };
    }
    if (!newEmail) {
        throw {
            statusCode: 400,
            message: "newEmail is required",
        };
    }
    if (!otp) {
        throw {
            statusCode: 400,
            message: "otp is required",
        };
    }

    const normalizedEmail = newEmail.trim().toLowerCase();
    const normalizedOtp = String(otp).trim();

    const data = await findOTP(userId);

    if (!data) {
        throw {
            statusCode: 404,
            message: "OTP not found",
        };
    }

    if (data.purpose !== "email_update") {
        throw {
            statusCode: 400,
            message: "Invalid OTP",
        };
    }

    if (String(data.otp).trim() !== normalizedOtp) {
        throw {
            statusCode: 400,
            message: "Invalid OTP",
        };
    }

    if (data.expires_at < new Date()) {
        throw {
            statusCode: 400,
            message: "OTP expired",
        };
    }

    const updatedUser = await updateProfile(userId, normalizedEmail, null, null);
    await deleteOTPsByUserId(userId);

    return updatedUser;
};