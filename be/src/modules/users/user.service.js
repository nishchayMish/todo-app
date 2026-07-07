import { DeleteImageFromCloudinary, UploadOnCloudinary } from "../../config/cloudinary.js";
import {
    clearProfileImage,
    findUserById,
    updateProfileImage,
    userProfile,
} from "./user.repository.js";

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
