"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to a user
    reason: { type: String, required: true },
    createdAt: Date // Reason for the report
});
const postSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: [] },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", }],
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comments", default: [] }],
    description: String,
    private: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    contentType: String,
    images: Array,
    video: String,
    reported: [reportSchema]
}, { timestamps: true });
exports.Post = mongoose_1.default.model("Post", postSchema);
