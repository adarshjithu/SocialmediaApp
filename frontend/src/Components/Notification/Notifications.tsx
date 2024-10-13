import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { RootState } from '../../app/store';
import { SocketContext } from '../../Context/SocketProvider';

const BirthdayNotification = () => {
    const [notifications, setNotifications] = useState<string[]>([]);
    const userData = useSelector((data: RootState) => data.auth?.userData?._id);

    const socket = useContext(SocketContext)
   
    useEffect(() => {
      
       if(socket) {socket.on('receiveNotification', (notification: string) => {
        console.log("notifivation,")
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        });}
        const timeout = setTimeout(()=>{
            setNotifications([])
        },5000)

        return () => {
         
            clearTimeout(timeout)
        };
    }, [socket,userData]);

    return (
        <div className="fixed top-5 right-5 z-50">
            {notifications?.map((notification, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-4 mb-4 transition-transform transform hover:scale-105">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                🎉
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-800">{notification}</p>
                            <p className="text-sm text-gray-500">Just now</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BirthdayNotification;
