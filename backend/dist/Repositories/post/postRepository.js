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
exports.PostRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel_1 = __importDefault(require("../../Models/commentModel"));
const postModels_1 = require("../../Models/postModels");
const storyModel_1 = __importDefault(require("../../Models/storyModel"));
const FollowModel_1 = __importDefault(require("../../Models/FollowModel"));
class PostRepository {
    //Create Post
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield postModels_1.Post.create(post);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Get all the post
    getAllPost(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const follow = yield FollowModel_1.default.findOne({ userId: userId });
                const followArr = [userId];
                follow === null || follow === void 0 ? void 0 : follow.following.forEach((data) => [followArr.push(data)]);
                follow === null || follow === void 0 ? void 0 : follow.followers.forEach((data) => [followArr.push(data)]);
                const res = yield postModels_1.Post.aggregate([
                    { $match: { isBlocked: false } },
                    { $match: { user: { $in: followArr } } },
                    {
                        $addFields: {
                            isLiked: { $in: [userId, "$likes"] },
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "likes",
                            foreignField: "_id",
                            as: "likesData",
                        },
                    },
                    { $unwind: "$userData" },
                ]).sort({ _id: -1 });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //For create post as video
    createVideoPost(postObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield postModels_1.Post.create(postObj);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Like post
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield postModels_1.Post.updateOne({ _id: postId }, { $push: { likes: userId } });
                return { success: true, userId: userId };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Unlike post
    unlikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield postModels_1.Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
                return { success: true, userId: userId };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Comment post
    commentPost(commentObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = new commentModel_1.default(commentObj);
                yield res.save();
                yield postModels_1.Post.updateOne({ _id: commentObj.postId }, {
                    $push: { comments: res._id },
                });
                const result = yield commentModel_1.default.findOne({ _id: res._id }).populate("userId");
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Get all comments
    getAllComments(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const res = await Comment.find({ postId: postId })
                const post = new mongoose_1.default.Types.ObjectId(postId);
                const res = yield commentModel_1.default.aggregate([
                    { $match: { postId: post } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $addFields: {
                            isLiked: { $in: [userId, "$likes"] },
                        },
                    },
                    {
                        $unwind: "$userData",
                    },
                ]).sort({ _id: -1 });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Like comment
    likeComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield commentModel_1.default.updateOne({ _id: commentId }, { $push: { likes: userId } });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Unlike Comment
    unlikeComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield commentModel_1.default.updateOne({ _id: commentId }, { $pull: { likes: userId } });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Unlike Comment
    replyComment(commentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newComment = new commentModel_1.default(data);
                yield newComment.save();
                yield commentModel_1.default.updateOne({ _id: commentId }, { $push: { replies: newComment } });
                const res = yield this.getAllReply(commentId, data.userId);
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Create Story
    createStory(storyObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExistsStory = yield storyModel_1.default.findOne({ userId: storyObj.userId });
                if (isExistsStory) {
                    yield storyModel_1.default.updateOne({ userId: storyObj.userId }, {
                        $push: {
                            stories: {
                                contentType: "image",
                                likes: [],
                                image: storyObj.stories[0].image,
                                expiresAt: storyObj.stories[0].expiresAt,
                            },
                        },
                    });
                    return yield storyModel_1.default.findOne({ userId: storyObj.userId }).populate("userId");
                }
                else {
                    const newStory = new storyModel_1.default(storyObj);
                    yield newStory.save();
                    return yield storyModel_1.default.findOne({ userId: storyObj.userId }).populate("userId");
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Create Story
    getAllStories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followData = yield FollowModel_1.default.findOne({ userId: userId }).lean();
                let followArr = [...((followData === null || followData === void 0 ? void 0 : followData.following) || []), ...((followData === null || followData === void 0 ? void 0 : followData.followers) || [])];
                const res = yield storyModel_1.default.find({ userId: { $in: followArr } })
                    .populate("userId")
                    .sort({ _id: -1 })
                    .lean();
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Like story
    likeStory(storyId, expiresAt, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield storyModel_1.default.updateOne({ _id: storyId, "stories.expiresAt": expiresAt }, {
                    $addToSet: { "stories.$.likes": userId },
                });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Like story
    getAllReply(replyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield commentModel_1.default.findOne({ _id: replyId })
                    .sort({ createdAt: -1 })
                    .populate({
                    path: "replies",
                    populate: {
                        path: "userId",
                        select: "name email",
                    },
                })
                    .lean();
                if (comments === null || comments === void 0 ? void 0 : comments.replies) {
                    comments.replies = comments.replies.map((obj) => {
                        obj.isLiked = obj.likes.some((like) => like.equals(new mongoose_1.default.Types.ObjectId(userId)));
                        return obj;
                    });
                }
                return comments;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Find comment byid
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield postModels_1.Post.findOne({ _id: postId });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    findCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield commentModel_1.default.findOne({ _id: commentId });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getPostById(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield postModels_1.Post.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(postId) } },
                    { $match: { isBlocked: false } },
                    {
                        $addFields: {
                            isLiked: { $in: [userId, "$likes"] },
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "userData",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "likes",
                            foreignField: "_id",
                            as: "likesData",
                        },
                    },
                    { $unwind: "$userData" },
                ]);
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getAllUsersForShare(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield FollowModel_1.default.findOne({ userId: userId }, { requests: 0 }).populate("following").populate("followers");
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return postModels_1.Post.deleteOne({ _id: postId });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    likeRepliedComment(userId, commentId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (type == "push")
                    return yield commentModel_1.default.updateOne({ _id: commentId }, { $push: { likes: userId } });
                else
                    return yield commentModel_1.default.updateOne({ _id: commentId }, { $pull: { likes: userId } });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    reportPost(userId, postId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportObj = {
                    userId: userId,
                    reason: reason,
                    createdAt: new Date(),
                };
                console.log(reportObj);
                return yield postModels_1.Post.updateOne({ _id: postId }, { $push: { reported: reportObj } });
            }
            catch (error) {
                console.log(error.message);
                return null;
            }
        });
    }
}
exports.PostRepository = PostRepository;
