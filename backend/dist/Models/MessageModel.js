"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    senderId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: String,
    file: { type: String, default: '' }
});
exports.Message = mongoose_1.default.model('Message', messageSchema);
