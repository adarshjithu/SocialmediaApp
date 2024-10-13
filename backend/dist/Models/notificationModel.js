"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    notifications: [
        {
            message: { type: String },
            userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
            createdAt: { type: Date },
            isViewed: { type: Boolean, default: false },
            postId: { type: mongoose_1.default.Types.ObjectId, ref: "Post" },
            image: String,
            data: String
        },
    ],
});
const Notification = mongoose_1.default.model("Notification", notificationSchema);
exports.default = Notification;
