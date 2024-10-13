import React, { createContext, useContext, useEffect, useRef, ReactNode, useState } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<any>(undefined);

export const SocketProvider:React.FC<any> = ({ children }) => {
    const [socket,setSocket] = useState<any>(null)
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    useEffect(() => {
        const newSocket = io("http://localhost:3000", {
            auth: {
                token: userData._id,
            },
        });

        setSocket(newSocket);
        return () => {
            newSocket.emit("updateOnline", userData._id);
            newSocket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
