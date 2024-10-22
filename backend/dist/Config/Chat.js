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
exports.createSocketConnectionForChat = void 0;
const socket_io_1 = require("socket.io"); // Import Socket.IO
const MessageModel_1 = require("../Models/MessageModel");
const mongoose_1 = require("mongoose"); // For proper typing of ObjectId
const socketIO_1 = require("./socketIO");
const Call_1 = require("./Call");
const video_1 = require("./video");
const notification_1 = require("./notification");
const createSocketConnectionForChat = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:5173", 'https://socialmedia-app-6zt7.vercel.app'],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    const usersOnline = {}; // Mapping userId to socketId
    io.on("connection", (socket) => {
        console.log("New connection");
        // Extract userId from auth token
        const userId = socket.handshake.auth.token;
        // sampleDemoCall(socket,io)
        (0, socketIO_1.createBirthdayNotification)(socket, userId, socket.id, io);
        (0, Call_1.createSocketConnectionForCall)(io, socket, usersOnline);
        (0, video_1.createSocketConnectionForVideo)(io, socket, usersOnline);
        (0, notification_1.socketForNotification)(io, socket, usersOnline);
        if (!userId) {
            console.log("Invalid user");
            return;
        }
        // Save userId to usersOnline with corresponding socketId
        usersOnline[userId] = socket.id;
        // Update user online status for chating
        io.emit("updateUserStatus", usersOnline);
        // Sending all the online users list for showing active friends
        io.emit("getAllOnlineUsers", usersOnline);
        // Listen for 'sendMessage' event
        socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId, message, status, type, file }) {
            try {
                // Save the message to MongoDB
                const newMessage = new MessageModel_1.Message({
                    senderId: new mongoose_1.Types.ObjectId(senderId), // Use ObjectId for sender
                    receiverId: new mongoose_1.Types.ObjectId(receiverId), // Use ObjectId for receiver
                    message,
                    read: status == "online" ? true : false,
                    type: type,
                    file: file,
                });
                yield newMessage.save();
                // Send message to the receiver if online
                if (usersOnline[receiverId]) {
                    io.to(usersOnline[receiverId]).emit("receiveMessage", { senderId, message, timestamp: new Date(), status, type, file });
                }
                else {
                    // console.log(`User ${receiverId} is offline, message saved`);
                }
            }
            catch (error) {
                console.error("Error saving message:", error);
            }
        }));
        socket.on("update", () => {
            io.emit("updateUserStatus", usersOnline);
            socket.emit("getAllOnlineUsers", usersOnline);
        });
        socket.on("getAllOnlineUsers", () => {
            socket.emit("getAllOnlineUsers", usersOnline);
        });
        socket.on("typing", ({ senderId, receiverId, status }) => {
            socket.to(usersOnline[receiverId]).emit("userTyping", status);
        });
        // Handle disconnect event
        socket.on("disconnect", () => {
            delete usersOnline[userId];
            io.emit("updateUserStatus", usersOnline);
            io.emit("getAllOnlineUsers", usersOnline);
            console.log(`User ${userId} disconnected`);
        });
    });
    return io;
};
exports.createSocketConnectionForChat = createSocketConnectionForChat;
