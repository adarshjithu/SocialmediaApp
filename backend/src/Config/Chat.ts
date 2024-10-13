import { Server } from "socket.io"; // Import Socket.IO
import { Message } from "../Models/MessageModel";
import { Types } from "mongoose"; // For proper typing of ObjectId
import { createBirthdayNotification } from "./socketIO";
import { createSocketConnectionForCall } from "./Call";
import { createSocketConnectionForVideo } from "./video";
import { socketForNotification } from "./notification";

// Interfaces
interface SocketAuth {
    token: string;
}

interface UserMessage {
    senderId: string;
    receiverId: string;
    message: string;
    status: string;
    type: string;
    file: any;
}

export const createSocketConnectionForChat = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const usersOnline: Record<string, string> = {}; // Mapping userId to socketId

    io.on("connection", (socket) => {
        console.log("New connection");

        // Extract userId from auth token
        const userId = (socket.handshake.auth as SocketAuth).token;
        createBirthdayNotification(socket, userId, socket.id, io);
        createSocketConnectionForCall(io, socket, usersOnline);
        createSocketConnectionForVideo(io, socket, usersOnline);
        socketForNotification(io,socket,usersOnline)
        
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
        socket.on("sendMessage", async ({ senderId, receiverId, message, status, type, file }: UserMessage) => {
            try {
                // Save the message to MongoDB

                const newMessage = new Message({
                    senderId: new Types.ObjectId(senderId), // Use ObjectId for sender
                    receiverId: new Types.ObjectId(receiverId), // Use ObjectId for receiver
                    message,
                    read: status == "online" ? true : false,
                    type: type,
                    file: file,
                });
                await newMessage.save();

                // Send message to the receiver if online
                if (usersOnline[receiverId]) {
                    io.to(usersOnline[receiverId]).emit("receiveMessage", { senderId, message, timestamp: new Date(), status, type, file });
                } else {
                    // console.log(`User ${receiverId} is offline, message saved`);
                }
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

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
