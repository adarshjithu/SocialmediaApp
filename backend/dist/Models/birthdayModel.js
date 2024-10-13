"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const birthdaySchema = new mongoose_1.default.Schema({ birthdays: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }] });
const Birthday = mongoose_1.default.model("Birthday", birthdaySchema);
exports.default = Birthday;
