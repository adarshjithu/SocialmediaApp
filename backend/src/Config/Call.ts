export const createSocketConnectionForCall = (io: any, socket: any, usersOnline: Record<string, any>) => {
    socket.on("join-room", (roomID: string) => {
        socket.join(roomID);
        socket.to(roomID).emit("user-connected", socket.id);
        socket.on("disconnect", () => {
            socket.to(roomID).emit("user-disconnected", socket.id);
        });
    });

    socket.on("send-offer", (data: Record<string, any>) => {
        socket.to(data.roomID).emit("receive-offer", data);
    });

    socket.on("send-answer", (data: Record<string, any>) => {
        socket.to(data.roomID).emit("receive-answer", data);
    });

    socket.on("send-ice-candidate", (data: Record<string, any>) => {
        socket.to(data.roomID).emit("receive-ice-candidate", data);
    });

    socket.on("online-users-list", () => {
        socket.emit("online-users-list-result", usersOnline);
    });

    socket.on("call-friend", (data: Record<string, any>) => {
        const receiverSocketId = usersOnline[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-friend", data.senderData);
        }
    });

    socket.on("end-call", (data: Record<string, any>) => {
        io.to(usersOnline[data.receiverId]).emit("end-call");
    });

    socket.on("call-accepted", (data: any) => {
        io.to(usersOnline[data]).emit("call-accepted", data);
    });

    socket.on("decline-call", (data: any) => {
        io.to(usersOnline[data]).emit("decline-call", data);
    });

    socket.on("mute-audio", (data: { receiverId: string }) => {
        io.to(usersOnline[data.receiverId]).emit("mute-audio");
    });
    socket.on("unmute-audio", (data: { receiverId: string }) => {
        io.to(usersOnline[data.receiverId]).emit("unmute-audio");
    });
};
