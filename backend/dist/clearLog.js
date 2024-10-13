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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_cron_1 = __importDefault(require("node-cron"));
const userModel_1 = require("./Models/userModel");
const birthdayModel_1 = __importDefault(require("./Models/birthdayModel"));
const logFilePath = path_1.default.join(__dirname, "../error.log");
// function for clear all the error logs
const clearLogFile = () => {
    if (fs_1.default.existsSync(logFilePath)) {
        fs_1.default.truncateSync(logFilePath, 0);
        console.log("Cleared error.log");
    }
    else {
        console.log("error.log does not exist");
    }
};
// Function for shedule birthday
const sheduleBirthday = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const day = today.getDay();
    const month = today.getMonth();
    const user = yield userModel_1.User.aggregate([{ $match: { dateofbirth: { $exists: true } } }, { $project: { _id: 1, dateofbirth: 1 } }]);
    const allbirthDay = user.filter((obj) => {
        const dob = new Date(obj.dateofbirth);
        if (month == dob.getMonth() && day == dob.getDay()) {
            return obj._id;
        }
    });
    const birthdayIds = allbirthDay.map((obj) => obj._id);
    yield birthdayModel_1.default.updateOne({}, { $set: { birthdays: birthdayIds } }, { upsert: true });
});
//Schedule the task to run every days at midnight
node_cron_1.default.schedule('0 0 * * *', () => {
    console.log('Running birthday scheduler at midnight');
    sheduleBirthday();
});
// Shedule delete error logs 20 day
node_cron_1.default.schedule("0 0 */20 * *", () => {
    clearLogFile();
});
