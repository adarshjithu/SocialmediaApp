"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    username: { type: String },
    email: { type: String },
    phonenumber: Number,
    password: String,
}, { timestamps: true });
exports.Admin = mongoose_1.default.model('Admin', userSchema);
