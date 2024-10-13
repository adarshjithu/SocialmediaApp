import React from "react";
import { noUserImage } from "../../Utils/utils";

function MutedComponent({user,unMuteVideo,where}:any) {
    return (
        <div className=" h-full bg-gray-600 rounded-lg mr-2 w-full h-full flex justify-center items-center" >
            <div className=" mr-2 w-full flex justify-center flex-col items-center">
                <img src={user?.image?user?.image:'https://via.placeholder.com/100'} alt="User Avatar" className="w-16 h-16 rounded-full mb-4" />

                <h2 className="text-lg font-semibold mb-2">{user?.name}</h2>

                <p className="text-sm text-white mb-4">Muted</p>

            <button onClick={()=>unMuteVideo()} className="bg-blue-500 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-green-600">Unmute</button>
            </div>
        </div>
    );
}

export default MutedComponent;
