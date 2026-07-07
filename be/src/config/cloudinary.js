import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export default cloudinary;

export const UploadOnCloudinary = async(filePath) => {
    try {
        const response = await cloudinary.uploader.upload(filePath, {
            folder: "todos"
        })
        return response;
    } catch (error) {
        return error;
    }
}

export const DeleteImageFromCloudinary = async(publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        return error;
    }
}