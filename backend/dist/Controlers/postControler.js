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
exports.PostControlers = void 0;
const httpStatusCodes_1 = require("../Constants/httpStatusCodes");
const uploadVideosToCloudinary_1 = require("../Utils/uploadVideosToCloudinary");
const consumers_1 = require("stream/consumers");
const { OK, BAD_REQUEST, UNAUTHORIZED, CONFLICT } = httpStatusCodes_1.STATUS_CODES;
class PostControlers {
    constructor(postServices) {
        this.postServices = postServices;
    }
    // @desc   ForUploading images to cloudinary
    // @route  POST /image/upload
    // @access Private
    uploadImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.userId;
                const description = req.body.description;
                const result = yield this.postServices.uploadImage(req.files, user, description);
                if (result === null || result === void 0 ? void 0 : result.success) {
                    res.status(OK).json(result);
                }
                else {
                    res.status(BAD_REQUEST).json(result);
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   For getting all the post for a specific user
    // @route  POST /image/upload
    // @access Private
    getAllPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allPost = yield this.postServices.getAllPosts(req.userId);
                if (allPost) {
                    res.status(OK).json(allPost);
                }
                else {
                    res.status(BAD_REQUEST).json(allPost);
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   For uploading video to user
    // @route  POST /video/upload
    // @access Private
    uploadVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, uploadVideosToCloudinary_1.uploadVideoToCloudinary)(req.file);
                if (result === null || result === void 0 ? void 0 : result.success) {
                    const successResult = yield this.postServices.createVideoPost(result === null || result === void 0 ? void 0 : result.videoUrl, req.body.description, req.userId);
                    if (successResult.success)
                        res.status(OK).json(successResult);
                    else
                        res.status(BAD_REQUEST).json(successResult);
                }
                else {
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Like post for user
    // @route  POST post/like
    // @access Private
    likePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.likePost(req.query.postId, req.userId);
                if (result.success)
                    res.status(OK).json(result);
                else
                    res.status(BAD_REQUEST).json(consumers_1.json);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Unlike post for user
    // @route  POST post/unlike
    // @access Private
    unlikePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.unlikePost(req.query.postId, req.userId);
                if (result.success)
                    res.status(OK).json(result);
                else
                    res.status(BAD_REQUEST).json(consumers_1.json);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Comment post
    // @route  POST post/comment
    // @access Private
    commentPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.commentPost(req.body.postId, req.body.comment, req.userId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get all comments for a specific user
    // @route  GET post/comments
    // @access Private
    getAllComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.getAllComments(req.query.postId, req.userId);
                if (result === null || result === void 0 ? void 0 : result.success)
                    res.status(OK).json(result);
                else
                    res.status(BAD_REQUEST).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To like a comment
    // @route  GET post/comment/like
    // @access Private
    likeComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.likeComment(req.query.commentId, req.userId);
                if (result === null || result === void 0 ? void 0 : result.success)
                    res.status(OK).json({ success: true });
                else
                    res.status(BAD_REQUEST).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   To unlike a comment
    // @route  GET post/comment/unlike
    // @access Private
    unlikeComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.unlikeComment(req.query.commentId, req.userId);
                if (result === null || result === void 0 ? void 0 : result.success)
                    res.status(OK).json({ success: true });
                else
                    res.status(BAD_REQUEST).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc  To reply for a comment
    // @route  POST post/comment/reply
    // @access Private
    replyComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.replyComment(req.body.text, req.body.commentId, req.userId);
                if (result)
                    res.status(OK).json(result);
                else
                    res.status(BAD_REQUEST).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc  Post feeling
    // @route  POST post/feeling
    // @access Private
    postFeeling(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.postFeeling(req.body.text, req.userId);
                if (result === null || result === void 0 ? void 0 : result.success)
                    res.status(OK).json(result);
                else {
                    res.status(BAD_REQUEST).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   ForUploading story images to cloudinary
    // @route  POST /image/upload
    // @access Private
    uploadStory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.userId;
                const result = yield this.postServices.uploadStoryImage(req.files, req.userId);
                if (result === null || result === void 0 ? void 0 : result.success) {
                    res.status(OK).json(result);
                }
                else {
                    res.status(BAD_REQUEST).json(result);
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   Getting all the stories of user
    // @route  POST /post/story
    // @access Private
    getAllStories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.getAllStories(req.userId);
                if (result)
                    res.status(OK).json(result);
                else
                    res.status(BAD_REQUEST).json(result);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   Getting all the stories of user
    // @route  POST /post/story
    // @access Private
    likeStory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.likeStory(req.body.storyId, req.body.expiresAt, req.userId);
                // if(result.success) res.status(OK).json({success:true})
                //      else res.status(BAD_REQUEST).json({success:false})
                // res.json({success:true})
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   Getting all the stories of user
    // @route  POST /post/story
    // @access Private
    getReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.getReply(req.query.replyId, req.userId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   To get postdata
    // @route  POST /post/post
    // @access Private
    getPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.getPost(req.query.postId, req.userId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   To get postdata
    // @route  POST /post/post
    // @access Private
    getUsersForShare(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.getUsersForShare(req.userId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   To Like replied comment
    // @route  POST /post/comment/reply/like
    // @access Private
    likeRepliedComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.likeRepliedComment(req.userId, req.body.commentId, req.body.type);
                if (result) {
                    res.status(OK).json({ success: true });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   To Reply Replied comment
    // @route  POST /post/comment/reply/reply
    // @access Private
    replyRepliedComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.replyRepliedComment(req.body.text, req.body.commentId, req.userId);
                if (result) {
                    res.status(OK).json(result);
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    // @desc   To report post
    // @route  POST /post/report
    // @access Private
    reportPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postServices.reportPost(req.userId, req.body.postId, req.body.reason);
                if (result) {
                    res.status(OK).json({ success: true, message: "Successfully Reported" });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: 'Error while reporting' });
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.PostControlers = PostControlers;
