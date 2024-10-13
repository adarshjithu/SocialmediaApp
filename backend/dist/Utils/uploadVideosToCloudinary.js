"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoToCloudinary = void 0;
const stream_1 = require("stream");
const cloudinary_1 = __importDefault(require("../Utils/cloudinary"));
const uploadVideoToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        try {
            if (!file) {
                reject({ success: false, message: 'No file uploaded' });
            }
            // Create a readable stream from the uploaded file
            const bufferStream = new stream_1.Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            // Upload video to Cloudinary
            const result = cloudinary_1.default.uploader.upload_stream({ resource_type: 'video' }, (error, res) => {
                if (error) {
                    reject({ success: false, message: 'Error uploading video' });
                }
                if (res) {
                    resolve({ videoUrl: res === null || res === void 0 ? void 0 : res.secure_url, success: true, message: "Video uploaded successfully" });
                }
            });
            bufferStream.pipe(result);
        }
        catch (error) {
            console.log(error);
            reject({ success: false, message: "Error uploading video" });
        }
    });
};
exports.uploadVideoToCloudinary = uploadVideoToCloudinary;
