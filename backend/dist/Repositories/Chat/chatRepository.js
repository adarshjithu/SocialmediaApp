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
exports.ChatRepository = void 0;
const MessageModel_1 = require("../../Models/MessageModel");
const userModel_1 = require("../../Models/userModel");
const feedbackModel_1 = __importDefault(require("../../Models/feedbackModel"));
class ChatRepository {
    constructor() { }
    getAllMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield MessageModel_1.Message.updateMany({ senderId: receiverId, receiverId: senderId }, { $set: { read: true } });
                const messages = yield MessageModel_1.Message.find({
                    $or: [
                        { senderId: senderId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId },
                    ],
                }).sort({ createdAt: 1 });
                return messages;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getAllUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield MessageModel_1.Message.aggregate([
                    {
                        $match: {
                            $or: [{ senderId: userId }, { receiverId: userId }],
                        },
                    },
                    {
                        $sort: { timestamp: -1 }, // Sort by the latest message (ensure `createdAt` field exists)
                    },
                    {
                        $group: {
                            _id: {
                                $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"], // Group by the other user (sender or receiver)
                            },
                            lastMessage: { $first: "$$ROOT" }, // Get the most recent message
                        },
                    },
                    {
                        $lookup: {
                            from: "users", // Assuming your user collection is called 'users'
                            localField: "_id",
                            foreignField: "_id",
                            as: "otherUser",
                        },
                    },
                    {
                        $unwind: "$otherUser", // Unwind the user details
                    },
                    {
                        $project: {
                            otherUser: 1, // Include the user details
                            lastMessage: 1, // Include the last message details
                        },
                    },
                ]);
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Search Users for to chat
    searchUsers(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield userModel_1.User.find({ name: { $regex: query, $options: "i" } });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Search Users for to chat
    saveFeedBack(feedback, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield feedbackModel_1.default.create({ userId, feedback });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all feedback
    getAllFeedback(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield feedbackModel_1.default.find({})
                    .limit(Number(page) * 5)
                    .populate("userId");
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all active friends
    getAllActiveFriends(friends, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield userModel_1.User.find({ _id: { $in: friends, $ne: userId } });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Clear all the chat
    clearAllChat(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield MessageModel_1.Message.deleteMany({ $or: [{ senderId: senderId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ] });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.ChatRepository = ChatRepository;
