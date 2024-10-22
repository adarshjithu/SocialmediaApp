"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketConnectionForCall = void 0;
const createSocketConnectionForCall = (io, socket, usersOnline) => {
    socket.on("join-room", (roomID) => {
        socket.join(roomID);
        console.log(`${socket.id} joined room: ${roomID}`);
        socket.to(roomID).emit("user-connected", socket.id);
        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected from room: ${roomID}`);
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
};
exports.createSocketConnectionForCall = createSocketConnectionForCall;
