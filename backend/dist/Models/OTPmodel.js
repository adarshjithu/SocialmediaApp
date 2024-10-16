"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a schema with a Mixed type field
const tempOtpSchema = new mongoose_1.default.Schema({
    userData: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true, // If you want to enforce that this field must be present
    },
    createdAt: {
        type: Date,
        default: Date.now, // Optional: Automatically set the creation date
        expires: '1h', // Optional: Automatically delete documents after 1 hour
    },
});
const TempOTP = mongoose_1.default.model("TempOTP", tempOtpSchema);
exports.default = TempOTP;
