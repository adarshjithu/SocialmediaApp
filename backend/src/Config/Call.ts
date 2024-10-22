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

 




   

   

   
};
