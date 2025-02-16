import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Load environment variables
dotenv.config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary and deletes the local file after successful upload.
 * If an error occurs, it logs the error but does not stop execution.
 * @param {string} localFilePath - The path to the file to upload.
 * @returns {Promise<object|null>} - Cloudinary response or null if an error occurs.
 */
const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
        console.warn("⚠️ File not found, skipping upload:", localFilePath);
        return null;
    }

    // console.log("🚀 Uploading file to Cloudinary:", localFilePath);

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            public_id: `uploaded_${Date.now()}`,
            fetch_format: "auto",
            quality: "auto",
        });

        // console.log("✅ File uploaded successfully:", response.secure_url);

        // Delete the local file after a successful upload
        fs.unlinkSync(localFilePath);
        // console.log("🗑️ Local file deleted:", localFilePath);

        return response;
    } catch (error) {
        console.warn("⚠️ Cloudinary upload failed, skipping file:", error.message);

        // Delete the file even if the upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("🗑️ Local file deleted due to upload failure:", localFilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };
