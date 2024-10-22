import { useContext, useEffect, useRef, useState } from "react";
import { noUserImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";

function IncomingCallModal() {
           
    return  (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 flex flex-col items-center md:w-[30%] w-[70%]">
                <div className="flex items-center justify-between w-full mb-4">
                    <h2 className="text-xl font-semibold text-white">{"Incoming Call"}</h2>
                    <button className="p-2 text-white hover:text-gray-300">
                        <span className="material-icons" >
                            close
                        </span>
                    </button>
                </div>
               
                <img
                    src={ noUserImage}
                    alt="User"
                    className="w-28 h-28 rounded-full border-4 border-white mb-4 transition-transform transform hover:scale-105"
                />

                <h3 className="text-lg font-semibold text-white">Adarsh</h3>
                <h3 className="text-lg font-medium text-white">Muted</h3>


               
                    <div className="flex space-x-8 mb-4 flex flex-col">
                        {/* Decline Call Button */}
                        <p className="text-gray-300 text-lg flex items-center justify-center"> Iscalling</p>{" "}
                        {/* Call duration */}
                        <div className="p-2">
                            <button className="p-3 mr-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200">
                                <span className="material-icons" >
                                    End_call
                                </span>
                            </button>
                            <button className="bg-blue-600 rounded-full p-2 w-[45px]">
                               
                                  
                               
                                    <i  className="fa-solid fa-microphone-slash " style={{ color: "white" }}></i>
                               
                            </button>
                        </div>
                    </div>
              
                    <div className="flex space-x-8 mb-4">
                        {/* Decline Call Button */}
                        <button className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200">
                            <span className="material-icons" >
                                Decline
                            </span>{" "}
                            {/* Decline Icon */}
                        </button>
                        {/* Accept Call Button */}
                        <button className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-200">
                            <span className="material-icons" >
                                Accept{" "}
                            </span>{" "}
                            {/* Accept Icon */}
                        </button>
                    </div>
                
            </div>
        </div>
  
    );
}

export default IncomingCallModal;
