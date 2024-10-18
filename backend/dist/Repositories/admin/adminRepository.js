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
exports.AdminRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminModel_1 = require("../../Models/adminModel");
const commentModel_1 = __importDefault(require("../../Models/commentModel"));
const postModels_1 = require("../../Models/postModels");
const userModel_1 = require("../../Models/userModel");
class AdminRepository {
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.User.updateOne({ _id: userId }, [
                    { $set: { isBlocked: { $cond: { if: { $eq: ["$isBlocked", true] }, then: false, else: true } } } },
                ]);
                const res = yield userModel_1.User.findOne({ _id: userId });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield postModels_1.Post.deleteMany({ user: userId });
                yield commentModel_1.default.deleteMany({ userId: userId });
                return yield userModel_1.User.deleteOne({ _id: userId });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield adminModel_1.Admin.findOne({ email: email });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllUsers(page, type, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filter = {};
                if (type == "active")
                    filter = { isBlocked: false };
                if (type == "blocked")
                    filter = { isBlocked: true };
                const skip = page * 10;
                return yield userModel_1.User.aggregate([{ $match: filter }, { $match: { name: { $regex: search, $options: "i" } } }])
                    .skip(skip)
                    .limit(10);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllPosts(page, type, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filter = { reported: { $ne: [] } };
                if (type == "active")
                    filter = { isBlocked: false, reported: { $ne: [] } };
                if (type == "blocked")
                    filter = { isBlocked: true, reported: { $ne: [] } };
                if (type == 'reported')
                    filter = { reported: { $ne: [] } };
                const skip = page * 10;
                // return await User.find(filter).skip(skip).limit(10);
                const res = yield postModels_1.Post.aggregate([
                    { $match: filter },
                    {
                        $match: { contentType: { $regex: search, $options: "i" } },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    { $unwind: "$userData" },
                ])
                    .sort({ _id: -1 })
                    .skip(skip)
                    .limit(10);
                return res;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield commentModel_1.default.deleteMany({ postId: postId });
                return yield postModels_1.Post.deleteOne({ _id: postId });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    blockPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModels_1.Post.findOne({ _id: postId });
                if (post === null || post === void 0 ? void 0 : post.isBlocked)
                    yield postModels_1.Post.updateOne({ _id: postId }, { $set: { isBlocked: false } });
                else
                    yield postModels_1.Post.updateOne({ _id: postId }, { $set: { isBlocked: true } });
                return post === null || post === void 0 ? void 0 : post.isBlocked;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getPostInfo(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allComments = yield commentModel_1.default.find({ postId: postId }).populate("userId");
                const allLikes = yield postModels_1.Post.findOne({ _id: postId }).populate("likes");
                return { likes: allLikes, comments: allComments };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentObjectId = new mongoose_1.default.Types.ObjectId(commentId);
                const comment = yield commentModel_1.default.findOne({ _id: commentId });
                yield postModels_1.Post.updateOne({ _id: comment.postId }, { $pull: { comments: commentObjectId } });
                return yield commentModel_1.default.deleteOne({ _id: commentId });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getDashBoard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = new Date();
                date.setHours(0, 0, 0, 0);
                const totalPost = yield postModels_1.Post.countDocuments();
                const totalUsers = yield userModel_1.User.countDocuments();
                const totalComments = yield commentModel_1.default.countDocuments();
                let likes = yield postModels_1.Post.aggregate([{ $unwind: "$likes" }, { $count: "totalLikes" }]);
                const totalLikes = likes[0].totalLikes;
                const todayPosts = yield postModels_1.Post.find({ createdAt: { $gt: date } });
                const todayPostCount = todayPosts.length;
                const todayUsers = yield userModel_1.User.find({ createdAt: { $gt: date } });
                const todayUserCount = todayUsers.length;
                const monthlyUser = yield userModel_1.User.aggregate([
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" },
                            },
                            userCount: { $sum: 1 }, // Count the number of users for each month
                        },
                    },
                    {
                        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
                    },
                ]);
                const monthlyUserCount = [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ];
                monthlyUser.forEach((obj) => {
                    const userCount = obj.userCount;
                    monthlyUserCount[obj._id.month - 1] = userCount;
                });
                const monthlyPost = yield postModels_1.Post.aggregate([
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" },
                            },
                            postCount: { $sum: 1 }, // Count the number of users for each month
                        },
                    },
                    {
                        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
                    },
                ]);
                const monthlyPostCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                monthlyPost.forEach((obj) => {
                    const postCount = obj.postCount;
                    const index = obj._id.month;
                    monthlyPostCount[index - 1] = postCount;
                });
                const dashBoardObj = {
                    totalPost: totalPost,
                    totalUsers: totalUsers,
                    totalComments: totalComments,
                    totalLikes: totalLikes,
                    todayPostCount: todayPostCount,
                    todayUserCount: todayUserCount,
                    monthlyUser: monthlyUserCount,
                    monthlyPost: monthlyPostCount
                };
                return dashBoardObj;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getReports(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield postModels_1.Post.findOne({ _id: postId }).populate("reported.userId");
                return res === null || res === void 0 ? void 0 : res.reported;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
