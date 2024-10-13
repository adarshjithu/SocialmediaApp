// client/src/VideoCall.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../Context/SocketProvider";
import { noUserImage } from "../../Utils/utils";

const IncomingVideoCall = ({user,acceptVideoCall}:any) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-white shadow-lg rounded-lg p-4 w-80 fixed top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <img src={user?.image?user?.image:noUserImage } alt="User Avatar" className="w-16 h-16 rounded-full mb-2" />

                <div className="text-center">
                    <h2 className="text-lg font-semibold">{user?.name}</h2>
                    <p className="text-sm text-gray-500">Incoming Video Call...</p>
                </div>

                <div className="flex justify-around w-full mt-4">
                    <div  className="cursor-pointer bg-[red] rounded-full p-2 w-[45px] h-[45px] flex justify-center items-center">
                    <i className="fa-solid fa-xmark fa-lg" style={{color:'white'}}></i>
                    </div>
                    <div  onClick={()=>acceptVideoCall()} className="cursor-pointer bg-[green] rounded-full p-2 w-[45px] h-[45px] flex justify-center items-center">
                    <i className="fa-solid fa-video fa-lg" style={{color:"white"}}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomingVideoCall;
