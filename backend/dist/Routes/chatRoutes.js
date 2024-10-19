"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatRepository_1 = require("../Repositories/Chat/chatRepository");
const chatServices_1 = require("../Services/chatServices");
const chatControler_1 = require("../Controlers/chatControler");
const userAuth_1 = require("../Middleware/userAuth");
const upload_1 = __importDefault(require("../Middleware/upload"));
const multer_1 = __importDefault(require("multer"));
const chatRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage(); // Store files in memory
const uploadAudio = (0, multer_1.default)({ storage: storage });
const chatRepository = new chatRepository_1.ChatRepository();
const chatServices = new chatServices_1.ChatServices(chatRepository);
const controler = new chatControler_1.ChatControler(chatServices);
chatRouter.get('/messages', userAuth_1.authenticate, (req, res, next) => controler.getAllMessages(req, res, next));
chatRouter.get("/users", userAuth_1.authenticate, (req, res, next) => controler.getAllChatedUsers(req, res, next));
chatRouter.get('/users/search', userAuth_1.authenticate, (req, res, next) => controler.searchUserForChat(req, res, next));
chatRouter.post("/feedback", userAuth_1.authenticate, (req, res, next) => { controler.sendFeedBack(req, res, next); });
chatRouter.get("/feedback", userAuth_1.authenticate, (req, res, next) => { controler.getFeedback(req, res, next); });
chatRouter.post("/active-friends", userAuth_1.authenticate, (req, res, next) => controler.activeFriends(req, res, next));
chatRouter.delete("/clear", userAuth_1.authenticate, (req, res, next) => controler.clearAllChat(req, res, next));
chatRouter.post("/image", userAuth_1.authenticate, upload_1.default.any(), (req, res, next) => controler.sendImage(req, res, next));
chatRouter.post("/audio", userAuth_1.authenticate, uploadAudio.single("audio"), (req, res, next) => controler.uploadAudio(req, res, next));
chatRouter.delete('/message', userAuth_1.authenticate, (req, res, next) => controler.deleteMessage(req, res, next));
exports.default = chatRouter;
