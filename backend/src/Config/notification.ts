import { Socket } from "socket.io";
import { IUser } from "../Models/userModel";

interface NotificationType {
    type: string;
    user: IUser;
    receiverId: string;
}
export const socketForNotification = (io: Record<string, any>, socket: Socket, usersOnline: Record<string, any>) => {
    socket.on("notification", (data: NotificationType) => {
        const user = { name: data.user.name, image: data.user.image };
        if (usersOnline[data.receiverId]) {
            
            socket.to(usersOnline[data.receiverId]).emit("notification", { type: data.type, user });
            socket.to(usersOnline[data.receiverId]).emit("notification-count");
        }
    });
};
