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
exports.ChatControler = void 0;
const httpStatusCodes_1 = require("../Constants/httpStatusCodes");
const upload_1 = require("../Utils/upload");
const cloudinary_1 = __importDefault(require("../Utils/cloudinary"));
const { OK, BAD_REQUEST, UNAUTHORIZED, CONFLICT } = httpStatusCodes_1.STATUS_CODES;
class ChatControler {
    constructor(chatServices) {
        this.chatServices = chatServices;
    }
    // @desc   To get all the messages
    // @route  GET /chat/messages
    // @access Private
    getAllMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.chatServices.getAllMessages(req.query.senderId, req.query.receiverId, req.query.page);
                if (result) {
                    res.status(200).json({ success: true, result: result });
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
    // @desc   To get all the users
    // @route  GET /chat/users
    // @access Private
    getAllChatedUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.chatServices.getAllUsers(req.userId);
                if (result)
                    res.status(OK).json({ success: true, result: result });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Search users
    // @route  GET /chat/users/search
    // @access Private
    searchUserForChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.chatServices.searchUser(req.query.query, req.userId);
                if (result)
                    res.status(OK).json({ success: true, result: result });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Send feedback
    // @route  GET /chat/feedback
    // @access Private
    sendFeedBack(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.chatServices.sendFeedBack(req.body.feedback, req.userId);
                if (result)
                    res.status(OK).json({ success: true, message: "Feedback has been successfully submited" });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc  Get  feedback
    // @route  GET /chat/feedback
    // @access Private
    getFeedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.chatServices.getFeedback(req.query.page);
                if (result)
                    res.status(OK).json({ success: true, result: result });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc To get all the activer frineds
    // @route  GET /chat/active-friends
    // @access Private
    activeFriends(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.chatServices.getAllActiveFriends(req.body.friends, req.userId);
                if (result)
                    res.status(OK).json({ success: true, result: result });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc To get all the activer frineds
    // @route  DELETE /chat/clear
    // @access Private
    clearAllChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.chatServices.clearAllChat(req.query.senderId, req.query.receiverId);
                if (result)
                    res.status(OK).json({ success: true });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc To send image to friends
    // @route  POST /chat/image
    // @access Private
    sendImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield (0, upload_1.uploadImageToCloudinary)(req.files);
                const images = (_a = result === null || result === void 0 ? void 0 : result.results) === null || _a === void 0 ? void 0 : _a.map((obj) => obj.url);
                if (result && images)
                    res.status(OK).json({ success: true, image: images[0] });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Upload audio
    // @route  POST /chat/audio
    // @access Private
    uploadAudio(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Create a Cloudinary upload stream
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ resource_type: "raw" }, // Specify 'raw' for audio
                (error, result) => {
                    if (error) {
                        return res.status(400).json({ error: "Audio upload failed" });
                    }
                    // Respond with the secure URL of the uploaded audio
                    res.status(200).json({ success: true, url: result === null || result === void 0 ? void 0 : result.secure_url });
                });
                // Check if req.file and req.file.stream exist
                if ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
                    // If the file is uploaded to memory, use the buffer
                    uploadStream.end(req.file.buffer);
                }
                else if ((_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.stream) {
                    // If the file is uploaded as a stream, pipe it to Cloudinary
                    req.file.stream.pipe(uploadStream);
                }
                else {
                    return res.status(400).json({ error: "No file provided" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ChatControler = ChatControler;
