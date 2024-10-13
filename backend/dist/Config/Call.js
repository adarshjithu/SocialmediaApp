"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketConnectionForCall = void 0;
const createSocketConnectionForCall = (io, socket, usersOnline) => {
    socket.on("join-room", (roomID) => {
        socket.join(roomID);
        socket.to(roomID).emit("user-connected", socket.id);
        socket.on("disconnect", () => {
            socket.to(roomID).emit("user-disconnected", socket.id);
        });
    });
    socket.on("send-offer", (data) => {
        socket.to(data.roomID).emit("receive-offer", data);
    });
    socket.on("send-answer", (data) => {
        socket.to(data.roomID).emit("receive-answer", data);
    });
    socket.on("send-ice-candidate", (data) => {
        socket.to(data.roomID).emit("receive-ice-candidate", data);
    });
    socket.on("online-users-list", () => {
        socket.emit("online-users-list-result", usersOnline);
    });
    socket.on("call-friend", (data) => {
        const receiverSocketId = usersOnline[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-friend", data.senderData);
        }
    });
    socket.on("end-call", (data) => {
        io.to(usersOnline[data.receiverId]).emit("end-call");
    });
    socket.on("call-accepted", (data) => {
        io.to(usersOnline[data]).emit("call-accepted", data);
    });
    socket.on("decline-call", (data) => {
        io.to(usersOnline[data]).emit("decline-call", data);
    });
    socket.on("mute-audio", (data) => {
        io.to(usersOnline[data.receiverId]).emit("mute-audio");
    });
    socket.on("unmute-audio", (data) => {
        io.to(usersOnline[data.receiverId]).emit("unmute-audio");
    });
};
exports.createSocketConnectionForCall = createSocketConnectionForCall;
