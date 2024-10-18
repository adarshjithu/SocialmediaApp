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
exports.AdminServices = void 0;
const messages_1 = require("../Constants/messages");
const notificationModel_1 = __importDefault(require("../Models/notificationModel"));
const password_1 = require("../Utils/password");
const token_1 = require("../Utils/token");
class AdminServices {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    // To get all the user data
    getAllUsers(page, type, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield this.adminRepository.getAllUsers(page, type, search);
                return allUsers;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //For blocking a user
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.adminRepository.blockUser(userId);
                if (res === null || res === void 0 ? void 0 : res.isBlocked) {
                    return { success: true, message: messages_1.MESSAGES.AUTHENTICATION.USER_BLOCK };
                }
                else {
                    return { success: true, message: messages_1.MESSAGES.AUTHENTICATION.USER_UNBLOCK };
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Deleting a specific user
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.deleteUser(userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Admin login
    login(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminRepository.getAdminByEmail(adminData.email);
                if (!admin)
                    return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.FAIL };
                const isPasswordValid = yield (0, password_1.comparePassword)(adminData === null || adminData === void 0 ? void 0 : adminData.password, admin.password);
                if (isPasswordValid) {
                    const adminAccessToken = (0, token_1.generateRefreshToken)(admin._id);
                    return { success: true, message: messages_1.MESSAGES.AUTHENTICATION.SUCCESS, admin: admin, adminAccessToken: adminAccessToken };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.INVALID_PASSWORD };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // To get all posts
    getAllPosts(page, type, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPosts = yield this.adminRepository.getAllPosts(page, type, search);
                return allPosts;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Delete a post
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.deletePostById(postId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // blockPost
    blockPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.adminRepository.blockPost(postId);
                if (res)
                    return { success: true, message: messages_1.MESSAGES.POST.BLOCKED_SUCCESS };
                else
                    return { success: false, message: messages_1.MESSAGES.POST.BLOCKED_FAILED };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get post information
    getPostInfo(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminRepository.getPostInfo(postId);
                if (result)
                    return { success: true, result: result };
                else {
                    success: false;
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    // Delete comment
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminRepository.deleteComment(commentId);
                if (result)
                    return { success: true, message: messages_1.MESSAGES.POST.COMMENT_DELETION_SUCCESS };
                else
                    return { success: false, message: messages_1.MESSAGES.POST.COMMENT_DELETION_FAILED };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    // Get Dashboard
    getDashBoardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.getDashBoard();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getReports(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.getReports(postId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addNotification(details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ((details === null || details === void 0 ? void 0 : details.message) == "ban-post") {
                    const reason = [];
                    for (let i of details.data) {
                        reason.push(i.reason);
                    }
                    const notificationObj = {
                        postId: details.postId,
                        message: "ban-post",
                        data: JSON.stringify(reason),
                        createdAt: new Date(),
                    };
                    yield notificationModel_1.default.updateOne({ userId: details.userId }, { $push: { notifications: notificationObj } }, { upsert: true });
                }
                if ((details === null || details === void 0 ? void 0 : details.message) == "ban-user") {
                    const notificationObj = {
                        postId: details.postId,
                        message: "ban-user",
                        data: '',
                        createdAt: new Date(),
                    };
                    yield notificationModel_1.default.updateOne({ userId: details.userId }, { $push: { notifications: notificationObj } }, { upsert: true });
                }
                console.log(details);
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.AdminServices = AdminServices;
