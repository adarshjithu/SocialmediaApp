"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const uploadImageToCloudinary = (files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!files || !Array.isArray(files)) {
            return { success: false, message: "No files uploaded" };
        }
        const uploadToCloudinary = (filePath) => {
            return new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload(filePath, { folder: "uploads" }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        };
        // Upload all files to Cloudinary
        const uploadPromises = files.map((file) => uploadToCloudinary(file.path));
        const results = yield Promise.all(uploadPromises);
        if (results) {
            return { success: true, message: "Image uploaded successfully", results: results };
        }
        else {
            return { success: false, message: "Uploading failed" };
        }
    }
    catch (error) {
        console.log(error);
        return { success: false, message: "Uploading failed" };
    }
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
