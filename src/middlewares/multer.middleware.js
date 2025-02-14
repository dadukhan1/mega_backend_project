import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the temp directory exists
const tempDir = "./public/temp/";
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // Preserve file extension
        const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_"); // Remove special characters
        cb(null, `${safeName}-${uniqueSuffix}${ext}`);
    },
});

export const upload = multer({ storage });
