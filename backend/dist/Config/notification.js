"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketForNotification = void 0;
const socketForNotification = (io, socket, usersOnline) => {
    socket.on("notification", (data) => {
        const user = { name: data.user.name, image: data.user.image };
        if (usersOnline[data.receiverId]) {
            socket.to(usersOnline[data.receiverId]).emit("notification", { type: data.type, user });
            socket.to(usersOnline[data.receiverId]).emit("notification-count");
        }
    });
};
exports.socketForNotification = socketForNotification;
