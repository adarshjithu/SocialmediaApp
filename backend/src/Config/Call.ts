import { Server, Socket } from "socket.io";

interface CallData {
    roomID: string;
    senderData?: any; // Define more specific types if possible
    receiverId: string;
}

export const createSocketConnectionForCall = (
    io: Server, 
    socket: Socket, 
    usersOnline: Record<string, string>
) => {
    // Joining a room
    socket.on("audio-join-room", (roomID: string) => {
        socket.join(roomID);
        console.log(`${socket.id} joined room: ${roomID}`); 
        socket.to(roomID).emit("audio-user-connected", socket.id);

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected from room: ${roomID}`);
            socket.to(roomID).emit("audio-user-disconnected", socket.id);
        });
    });

    // Sending an offer
    socket.on("audio-send-offer", (data: CallData) => {
        socket.to(data.roomID).emit("audio-receive-offer", data);
    });

    // Sending an answer
    socket.on("audio-send-answer", (data: CallData) => {
        socket.to(data.roomID).emit("audio-receive-answer", data);
    });

    // Sending ICE candidates
    socket.on("audio-send-ice-candidate", (data: CallData) => {
        socket.to(data.roomID).emit("audio-receive-ice-candidate", data);
    });

    // Fetching the online users list
    socket.on("audio-online-users-list", () => {
        socket.emit("audio-online-users-list-result", usersOnline);
    });

    // Starting a call
    socket.on("audio-start-call", (data: CallData) => {
        const receiverSocketId = usersOnline[data?.receiverId];
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit('audio-start-call', data);
        }
    });
};
