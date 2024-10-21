import { Server, Socket } from "socket.io";

interface CallData {
    roomID: string;
    senderData?: any; // Define more specific types if possible
    receiverId: string;
}

export const createSocketConnectionForCall = (io: Server, socket: Socket, usersOnline: Record<string, string>) => {
    socket.on("join-room", (roomID: string) => {
        socket.join(roomID);
        console.log(`${socket.id} joined room: ${roomID}`);
        socket.to(roomID).emit("user-connected", socket.id);

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected from room: ${roomID}`);
            socket.to(roomID).emit("user-disconnected", socket.id);
        });
    });

    socket.on("send-offer", (data: CallData) => {
        socket.to(data.roomID).emit("receive-offer", data);
    });

    socket.on("send-answer", (data: CallData) => {
        socket.to(data.roomID).emit("receive-answer", data);
    });

    socket.on("send-ice-candidate", (data: CallData) => {
        socket.to(data.roomID).emit("receive-ice-candidate", data);
    });

    socket.on("online-users-list", () => {
        socket.emit("online-users-list-result", usersOnline);
    });

    socket.on("call-friend", (data: CallData) => {
        const receiverSocketId = usersOnline[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-friend", data.senderData);
            console.log(`Call from ${data.senderData.name} to ${data.receiverId}`);
        } else {
            console.error(`Receiver with ID ${data.receiverId} is not online.`);
        }
    });

    socket.on("end-call", (data: CallData) => {
        const receiverSocketId = usersOnline[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("end-call");
            console.log(`Call ended for ${data.receiverId}`);
        }
    });

    socket.on("call-accepted", (receiverId: string) => {
        const receiverSocketId = usersOnline[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-accepted", receiverId);
            console.log(`${receiverId} accepted the call`);
        }
    });

    socket.on("decline-call", (receiverId: string) => {
        const receiverSocketId = usersOnline[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("decline-call", receiverId);
            console.log(`${receiverId} declined the call`);
        }
    });

    socket.on("mute-audio", (data: { receiverId: string }) => {
        const receiverSocketId = usersOnline[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("mute-audio");
            console.log(`${data.receiverId} has muted audio`);
        }
    });

    socket.on("unmute-audio", (data: { receiverId: string }) => {
        const receiverSocketId = usersOnline[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("unmute-audio");
            console.log(`${data.receiverId} has unmuted audio`);
        }
    });
};
