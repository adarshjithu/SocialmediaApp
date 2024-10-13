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
exports.PostServices = void 0;
const upload_1 = require("../Utils/upload");
const messages_1 = require("../Constants/messages");
const userRepository_1 = __importDefault(require("../Repositories/user/userRepository"));
const userRepository = new userRepository_1.default();
class PostServices {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    //Upload image
    uploadImage(files, user, description) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const results = yield (0, upload_1.uploadImageToCloudinary)(files);
                if (!results.success)
                    return { success: false, message: "Uploading failed" };
                const images = (_a = results === null || results === void 0 ? void 0 : results.results) === null || _a === void 0 ? void 0 : _a.map((obj) => obj === null || obj === void 0 ? void 0 : obj.url);
                const postObj = {
                    user: user,
                    description: description,
                    contentType: "image",
                    images: images,
                };
                const isUploaded = yield this.postRepository.createPost(postObj);
                if (isUploaded) {
                    return { success: true, message: messages_1.MESSAGES.UPLOAD.UPLOAD_SUCCESS, data: results };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_FAIL };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_FAIL };
            }
        });
    }
    //Getting all the post of a specific user
    getAllPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.postRepository.getAllPost(userId);
                if (posts)
                    return { success: true, posts: posts };
                else
                    return { success: false };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    createVideoPost(video, description, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postObj = {
                    user: user,
                    description: description,
                    contentType: "video",
                    video: video,
                };
                const result = yield this.postRepository.createVideoPost(postObj);
                if (result)
                    return { success: true, message: messages_1.MESSAGES.UPLOAD.UPLOAD_VIDEO_SUCCESS };
                else
                    return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_VIDEO_FAIL };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_VIDEO_FAIL };
            }
        });
    }
    //Like post
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Taking post details for storing post data in the notification
                const post = yield this.postRepository.findPostById(postId);
                // Checking current user likes the his own post
                if (String(post.user) !== String(userId)) {
                    yield userRepository.addNotification(post.user, { userId: userId, message: "like", postId: postId, image: post.images[0], data: '', createdAt: new Date });
                }
                const res = yield this.postRepository.likePost(postId, userId);
                if (res)
                    return { success: true, userId: res.userId };
                else
                    return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
            }
        });
    }
    //unLike post
    unlikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.postRepository.unlikePost(postId, userId);
                if (res)
                    return { success: true, userId: res.userId };
                else
                    return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
            }
        });
    }
    //comment post
    commentPost(postId, comment, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Taking post details for storing post data in the notification
                const post = yield this.postRepository.findPostById(postId);
                // Checking current user likes the his own post
                if (String(post.user) !== String(userId)) {
                    yield userRepository.addNotification(post.user, { userId: userId, message: "comment", postId: postId, image: post.images[0], data: comment, createdAt: new Date() });
                }
                const commentObj = { postId: postId, userId: userId, content: comment, likes: [], replies: [] };
                const result = yield this.postRepository.commentPost(commentObj);
                return result;
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    //Get all comments for a post
    getAllComments(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postRepository.getAllComments(postId, userId);
                if (result)
                    return { success: true, comments: result };
                else
                    return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
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
                const commentData = yield this.postRepository.findCommentById(commentId);
                const comment = commentData === null || commentData === void 0 ? void 0 : commentData.content;
                const postId = commentData === null || commentData === void 0 ? void 0 : commentData.postId;
                const postData = yield this.postRepository.findPostById(String(postId));
                const image = postData.images[0];
                const postedUser = postData.user;
                //Create notification object for storing notification
                const notificationObj = {
                    userId: userId, message: "like comment", postId: postId, image, data: comment, createdAt: new Date()
                };
                // Storing notification
                if (String(postedUser) !== String(userId)) {
                    yield userRepository.addNotification(postedUser, notificationObj);
                }
                const result = yield this.postRepository.likeComment(commentId, userId);
                if (result)
                    return { success: true };
                else
                    return { success: false };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Unlike comment
    unlikeComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postRepository.unlikeComment(commentId, userId);
                if (result)
                    return { success: true };
                else
                    return { success: false };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //reply comment
    replyComment(text, commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentData = yield this.postRepository.findCommentById(commentId);
                const comment = commentData === null || commentData === void 0 ? void 0 : commentData.content;
                const postId = commentData === null || commentData === void 0 ? void 0 : commentData.postId;
                const postData = yield this.postRepository.findPostById(String(postId));
                const image = postData.images[0];
                const postedUser = postData.user;
                //Create notification object for storing notification
                const notificationObj = {
                    userId: userId, message: "reply comment", postId: postId, image, data: comment, createdAt: new Date()
                };
                // Storing notification
                if (String(postedUser) !== String(userId)) {
                    yield userRepository.addNotification(postedUser, notificationObj);
                }
                const replyObj = { postId: null, userId: userId, content: text, likes: [] };
                const res = yield this.postRepository.replyComment(commentId, replyObj);
                if (res)
                    return { success: true, result: res };
                else
                    return { success: false };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Post feeling
    postFeeling(text, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postObj = {
                    user: userId,
                    description: text,
                    contentType: "text",
                };
                const res = yield this.postRepository.createPost(postObj);
                if (res)
                    return { success: true, message: messages_1.MESSAGES.POST.SUCCESS };
                else
                    return { success: false, message: messages_1.MESSAGES.POST.FAILED };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Upload image
    uploadStoryImage(files, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const results = yield (0, upload_1.uploadImageToCloudinary)(files);
                if (!results.success)
                    return { success: false, message: "Uploading failed" };
                const images = (_a = results === null || results === void 0 ? void 0 : results.results) === null || _a === void 0 ? void 0 : _a.map((obj) => obj === null || obj === void 0 ? void 0 : obj.url);
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24); // Set expiration time to 24 hours from now
                const storyObj = {
                    userId: user,
                    stories: [{ contentType: "image", likes: [], image: images === null || images === void 0 ? void 0 : images[0], expiresAt: expiresAt }],
                };
                const isUploaded = yield this.postRepository.createStory(storyObj);
                if (isUploaded) {
                    return { success: true, message: messages_1.MESSAGES.UPLOAD.UPLOAD_SUCCESS, data: isUploaded };
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.UPLOAD.UPLOAD_FAIL };
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Upload image
    getAllStories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.postRepository.getAllStories(userId);
                if (res)
                    return { success: true, result: res };
                else
                    return { success: false };
            }
            catch (error) {
                console.log(error);
                {
                    success: false;
                }
            }
        });
    }
    //Like Story
    likeStory(storyId, expiresAt, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postRepository.likeStory(storyId, expiresAt, userId);
                if (result)
                    return { success: true };
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    //Get reply
    getReply(replyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postRepository.getAllReply(replyId, userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Get post
    getPost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postRepository.getPostById(postId, userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Get all the users for sharing post
    getUsersForShare(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.postRepository.getAllUsersForShare(userId);
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Delete post
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.postRepository.deletePostById(postId);
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Like replied comment
    likeRepliedComment(userId, commentId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.postRepository.likeRepliedComment(userId, commentId, type);
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Reply Replied Comment
    replyRepliedComment(text, commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const replyObj = { postId: null, userId: userId, content: text, likes: [] };
                const res = yield this.postRepository.replyComment(commentId, replyObj);
                if (res)
                    return { success: true, result: res };
                else
                    return { success: false };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Reply Replied Comment
    reportPost(userId, postId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.postRepository.reportPost(userId, postId, reason);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.PostServices = PostServices;
