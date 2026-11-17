import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

// Safe async unlink to prevent Windows EBUSY / EPERM file locking errors
const safeUnlink = async (filePath, retries = 5, delay = 200) => {
    if (!filePath) return;
    for (let i = 0; i < retries; i++) {
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
            return;
        } catch (err) {
            if (i === retries - 1) {
                console.warn(`Could not unlink temporary file ${filePath}:`, err.message);
            } else {
                await new Promise((res) => setTimeout(res, delay));
            }
        }
    }
};

const uploadOnCloudinary = async (localFilePath, options = {}) => {
    try {
        if (!localFilePath) return null;
        const uploadOptions = {
            resource_type: "auto",
            ...options
        };
        const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);
        await safeUnlink(localFilePath);
        return response;
    } catch(err) {
        await safeUnlink(localFilePath);
        console.error("Cloudinary upload error:", err);
        return null;
    }
};

export { uploadOnCloudinary, safeUnlink };

