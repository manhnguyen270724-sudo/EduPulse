import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "./public/temp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// File filter for KYC and general uploads (allows images, pdf, office docs, archives)
// Rejects executable files (.exe, .bat, .cmd, .sh, .js)
const safeFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const dangerousExts = [".exe", ".bat", ".cmd", ".sh", ".js", ".msi", ".vbs", ".scr", ".com"];
  if (dangerousExts.includes(ext)) {
    return cb(new Error("Loại tệp không được phép vì lý do an toàn!"), false);
  }
  cb(null, true);
};

export const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: safeFileFilter
});
