"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configure Multer storage options
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../uploads/videos')); // Store in a 'videos' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// File filter to allow only video files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['video/mp4', 'video/mkv', 'video/avi', 'video/webm'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only video files are allowed.'), false);
    }
};
// Initialize Multer with video limits and file filter
const uploadVideo = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // Max file size (50 MB, for example)
    },
});
exports.default = uploadVideo;
