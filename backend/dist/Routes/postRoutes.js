"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postRepository_1 = require("../Repositories/post/postRepository");
const postServices_1 = require("../Services/postServices");
const postControler_1 = require("../Controlers/postControler");
const upload_1 = __importDefault(require("../Middleware/upload"));
const userAuth_1 = require("../Middleware/userAuth");
const multer_1 = __importDefault(require("multer"));
const postRouter = express_1.default.Router();
const uploadVideo = (0, multer_1.default)();
const postRepository = new postRepository_1.PostRepository();
const postServices = new postServices_1.PostServices(postRepository);
const controler = new postControler_1.PostControlers(postServices);
// Comment
postRouter.get("/comment/like", userAuth_1.authenticate, (req, res, next) => controler.likeComment(req, res, next));
postRouter.post("/comment", userAuth_1.authenticate, (req, res, next) => controler.commentPost(req, res, next));
postRouter.get("/comment/unlike", userAuth_1.authenticate, (req, res, next) => controler.unlikeComment(req, res, next));
postRouter.post("/comment/reply", userAuth_1.authenticate, (req, res, next) => controler.replyComment(req, res, next));
postRouter.get('/comments', userAuth_1.authenticate, (req, res, next) => controler.getAllComments(req, res, next));
postRouter.get("/comment/reply", userAuth_1.authenticate, (req, res, next) => controler.getReply(req, res, next));
postRouter.patch("/comment/reply/like", userAuth_1.authenticate, (req, res, next) => controler.likeRepliedComment(req, res, next));
postRouter.post("/comment/reply/reply", userAuth_1.authenticate, (req, res, next) => controler.replyRepliedComment(req, res, next));
// Story
postRouter.get("/story", userAuth_1.authenticate, (req, res, next) => controler.getAllStories(req, res, next));
postRouter.post('/story/image/upload', userAuth_1.authenticate, upload_1.default.any(), (req, res, next) => controler.uploadStory(req, res, next));
postRouter.patch('/story/like', userAuth_1.authenticate, (req, res, next) => controler.likeStory(req, res, next));
// Upload
postRouter.post('/image/upload', userAuth_1.authenticate, upload_1.default.any(), (req, res, next) => { controler.uploadImage(req, res, next); }); //
postRouter.post('/video/upload', userAuth_1.authenticate, uploadVideo.single('video'), (req, res, next) => controler.uploadVideo(req, res, next));
postRouter.get("/posts", userAuth_1.authenticate, (req, res, next) => controler.getAllPost(req, res, next));
postRouter.get("/like", userAuth_1.authenticate, (req, res, next) => { controler.likePost(req, res, next); });
postRouter.get("/unlike", userAuth_1.authenticate, (req, res, next) => controler.unlikePost(req, res, next));
postRouter.post('/feeling', userAuth_1.authenticate, (req, res, next) => controler.postFeeling(req, res, next));
postRouter.get("/post", userAuth_1.authenticate, (req, res, next) => controler.getPost(req, res, next));
postRouter.get('/share', userAuth_1.authenticate, (req, res, next) => controler.getUsersForShare(req, res, next));
postRouter.post('/report', userAuth_1.authenticate, (req, res, next) => controler.reportPost(req, res, next));
exports.default = postRouter;
