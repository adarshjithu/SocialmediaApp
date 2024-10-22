import React, { createContext, useContext, useEffect, useRef, ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../app/store";

export const SocketContext = createContext<any>(undefined);

export const SocketProvider:React.FC<any> = ({ children }) => {
    const [socket,setSocket] = useState<any>(null)
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const data = useSelector((data:RootState)=>data?.auth?.userData)

   

    useEffect(() => {
        if(data){

            const newSocket = io("https://friendzy.site", {
                auth: {
                    token: userData._id,
                },
            });
    
            setSocket(newSocket);
            return () => {
                newSocket.emit("updateOnline", userData._id);
                newSocket.disconnect();
            };
        }
    }, [data]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
