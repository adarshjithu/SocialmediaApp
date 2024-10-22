"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketConnectionForVideo = void 0;
const createSocketConnectionForVideo = (io, socket, usersOnline) => {
    // Join room event
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
    });
    // Listen for offer
    socket.on("offer", ({ roomId, offer }) => {
        socket.to(roomId).emit("offer", offer);
    });
    // Listen for answer
    socket.on("answer", ({ roomId, answer }) => {
        socket.to(roomId).emit("answer", answer);
    });
    // Listen for ICE candidates
    socket.on("ice-candidate", ({ roomId, candidate }) => {
        socket.to(roomId).emit("ice-candidate", candidate);
    });
    // Listen for incoming video call
    socket.on("incoming-video-call", (data) => {
        const receiverSocketId = usersOnline[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incoming-video-call", data);
        }
    });
    // Listen for call accepted
    socket.on("call-accepted", (data) => {
        const receiverSocketId = usersOnline[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-accepted");
        }
    });
    // Mute video
    socket.on("mute-video", (data) => {
        io.to(usersOnline[data.receiverId]).emit("mute-video");
    });
    // Unmute video
    socket.on("unmute-video", (data) => {
        io.to(usersOnline[data.receiverId]).emit("unmute-video");
    });
    // End video call
    socket.on('end-call', (data) => {
        io.to(usersOnline[data.receiverId]).emit('end-call');
    });
};
exports.createSocketConnectionForVideo = createSocketConnectionForVideo;
