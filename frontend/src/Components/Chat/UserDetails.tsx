import React from "react";
import { noUserImage } from "../../Utils/utils";

function UserDetails({callUser,user,message,mute}:any) {
    return (
        <div className="w-[100%] bg-gray-600 rounded-lg  h-full">
            <div className="md:h-full w-full flex justify-center flex-col items-center">
                <img src={user?.image?user?.image:'https://via.placeholder.com/100'} alt="User Avatar" className="w-16 h-16 rounded-full mb-4" />

                <h2 className="text-lg font-semibold mb-2">{user?.name}</h2>

                <p className="text-sm text-white mb-4">{mute?'Muted':message}</p>

                {!mute&&<button onClick={callUser} className="bg-green-500 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-green-600">{message=='Incoming call'?"Accept Call":'Start Call'}</button>}
            </div>
        </div>
    );
}

export default UserDetails;
