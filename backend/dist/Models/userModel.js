"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    username: { type: String, default: '' },
    bio: { type: String, default: "" },
    dateofbirth: String,
    email: { type: String },
    phonenumber: Number,
    password: String,
    socketId: String,
    image: { type: String },
    isBlocked: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
