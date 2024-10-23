"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketConnectionForCall = void 0;
const createSocketConnectionForCall = (io, socket, usersOnline) => {
    // Joining a room
    socket.on("audio-join-room", (roomID) => {
        socket.join(roomID);
        console.log(`${socket.id} joined room: ${roomID}`);
        socket.to(roomID).emit("audio-user-connected", socket.id);
        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected from room: ${roomID}`);
            socket.to(roomID).emit("audio-user-disconnected", socket.id);
        });
    });
    // Sending an offer
    socket.on("audio-send-offer", (data) => {
        console.log('send offer');
        socket.to(data.roomID).emit("audio-receive-offer", data);
    });
    // Sending an answer
    socket.on("audio-send-answer", (data) => {
        console.log('send-answer');
        socket.to(data.roomID).emit("audio-receive-answer", data);
    });
    // Sending ICE candidates
    socket.on("audio-send-ice-candidate", (data) => {
        socket.to(data.roomID).emit("audio-receive-ice-candidate", data);
        console.log('sendice candidate');
    });
    // Fetching the online users list
    socket.on("audio-online-users-list", () => {
        socket.emit("audio-online-users-list-result", usersOnline);
    });
    // Starting a call
    socket.on("audio-start-call", (data) => {
        console.log('audio start call', data);
        socket.to(usersOnline[data === null || data === void 0 ? void 0 : data.receiverId]).emit('audio-start-call', data);
    });
    socket.on('audio-accept-call', (data) => {
        io.to(usersOnline[data._id]).emit("audio-accept-call");
    });
    socket.on("audio-cancel-call", (data) => {
        socket.to(usersOnline[data === null || data === void 0 ? void 0 : data.receiverId]).emit("audio-cancel-call");
    });
    socket.on('audio-start-talking', (data) => {
        socket.to(usersOnline[data._id]).emit('audio-start-talking');
    });
    socket.on('audio-decline-call', (data) => {
        socket.to(usersOnline[data === null || data === void 0 ? void 0 : data.receiverId]).emit("audio-decline-call");
    });
    socket.on('audio-accept-call', (data) => {
        socket.to(usersOnline[data === null || data === void 0 ? void 0 : data.receiverId]).emit("audio-accept-call");
    });
    socket.on("audio-stop-calling", (data) => {
        socket.to(usersOnline[data === null || data === void 0 ? void 0 : data.receiverId]).emit("audio-stop-calling");
    });
};
exports.createSocketConnectionForCall = createSocketConnectionForCall;
