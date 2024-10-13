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
exports.createBirthdayNotification = void 0;
const userModel_1 = require("../Models/userModel");
const birthdayModel_1 = __importDefault(require("../Models/birthdayModel"));
// Function to create the Socket.IO connection
const createBirthdayNotification = (socket, userId, socketId, io) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId) {
        try {
            const user = yield userModel_1.User.findOne({ _id: userId });
            if (!user) {
                console.log(`User with ID ${userId} not found.`);
                return;
            }
            const birthdaysData = yield birthdayModel_1.default.findOne({});
            const birthdayArr = (birthdaysData === null || birthdaysData === void 0 ? void 0 : birthdaysData.birthdays) || [];
            if (birthdayArr.includes(user._id.toString())) {
                socket.emit("receiveNotification", `Happy Birthday, ${user === null || user === void 0 ? void 0 : user.name}!`);
                yield birthdayModel_1.default.updateOne({}, { $pull: { birthdays: user._id } });
            }
        }
        catch (error) {
            console.error("Error checking or sending birthday notification:", error);
        }
    }
});
exports.createBirthdayNotification = createBirthdayNotification;
