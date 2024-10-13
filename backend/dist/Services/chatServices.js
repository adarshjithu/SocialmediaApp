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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServices = void 0;
class ChatServices {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    // For gettting all the messages
    getAllMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.getAllMessages(senderId, receiverId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // For fetching all the users related to message
    getAllUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.getAllUsers(userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Search users for chat
    searchUser(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.searchUsers(query, userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Search users for chat
    sendFeedBack(feedback, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.saveFeedBack(feedback, userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get feedback
    getFeedback(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.chatRepository.getAllFeedback(page);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get feedback
    getAllActiveFriends(friends, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.getAllActiveFriends(friends, userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get feedback
    clearAllChat(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.chatRepository.clearAllChat(senderId, receiverId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.ChatServices = ChatServices;
