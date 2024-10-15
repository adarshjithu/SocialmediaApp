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
exports.AdminControler = void 0;
const httpStatusCodes_1 = require("../Constants/httpStatusCodes");
const { OK, UNAUTHORIZED, BAD_REQUEST } = httpStatusCodes_1.STATUS_CODES;
class AdminControler {
    constructor(adminServices) {
        this.adminServices = adminServices;
    }
    // @desc   Getting all the user data
    // @route  Get /admin/users
    // @access Admin
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield this.adminServices.getAllUsers(req.query.page ? Number(req.query.page) : 0, req.query.type, req.query.search);
                res.status(OK).json({ users: allUsers });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To block a user
    // @route  Get admin/user/block
    // @access Admin
    blockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.blockUser(req === null || req === void 0 ? void 0 : req.query.userId);
                res.status(OK).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To delete a user
    // @route  Get admin/user/delete
    // @access Admin
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.deleteUser(req === null || req === void 0 ? void 0 : req.query.userId);
                res.status(OK).json({ success: true, message: "User Deleted Successfully!" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Admin SignIn
    // @route  Get admin/login
    // @access Admin
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.login(req.body);
                const accessTokenMaxAge = 48 * 60 * 60 * 1000;
                if (result === null || result === void 0 ? void 0 : result.success) {
                    res.cookie("admin_access_token", result.adminAccessToken, {
                        maxAge: accessTokenMaxAge,
                        secure: true,
                        httpOnly: true,
                        sameSite: "none"
                        // Prevent JavaScript access to the cookie
                    });
                    res.status(OK).json(result);
                }
                else {
                    res.status(UNAUTHORIZED).json(result);
                }
            }
            catch (error) {
                next();
            }
        });
    }
    // @desc   Admin logout
    // @route  Get admin/logout
    // @access Admin
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie("admin_access_token", "", { maxAge: 0 });
                res.status(OK).json({ success: true, message: "Admin logout successfull" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Admin get all post
    // @route  Get admin/posts
    // @access Admin
    getAllPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPosts = yield this.adminServices.getAllPosts(req.query.page ? Number(req.query.page) : 0, req.query.type, req.query.search);
                res.status(OK).json({ posts: allPosts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Admin delete post
    // @route  Delete admin/post
    // @access Admin
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.deletePost(req.query.postId);
                if (result)
                    res.status(OK).json({ success: true, message: "Successfully Deleted" });
                else
                    res.status(OK).json({ success: false, message: "Some error occured post not deleted" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Admin block post
    // @route  Delete admin/post/block
    // @access Admin
    blockPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.blockPost(req.query.postId);
                if (result === null || result === void 0 ? void 0 : result.success)
                    res.status(OK).json(result);
                else
                    res.status(OK).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Admin block post
    // @route  Delete admin/post/block
    // @access Admin
    getPostInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield this.adminServices.getPostInfo(req.query.postId);
                if (postData === null || postData === void 0 ? void 0 : postData.success)
                    res.status(OK).json(postData);
                else
                    res.status(BAD_REQUEST).json(postData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Delete comment
    // @route  Delete admin/post/comment/delete
    // @access Admin
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield this.adminServices.deleteComment(req.query.commentId);
                if (postData === null || postData === void 0 ? void 0 : postData.success)
                    res.status(OK).json(postData);
                else
                    res.status(BAD_REQUEST).json(postData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Dashboard
    // @route  admin/dashboard
    // @access Dashboard
    dashboard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.getDashBoardData();
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get reports
    // @route  admin/reports
    // @access admin
    getReports(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.getReports(req.query.postId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminControler = AdminControler;
