import { Button, TextField } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { IUser } from "../../interfaces/Interface";
import UserList from "./UserList";
import Message from "./Message";
import { io, Socket } from "socket.io-client";
import { searchUserForChat } from "../../Services/apiService/chatServices";
import { noChatImage } from "../../Utils/utils";
import { SocketContext } from "../../Context/SocketProvider";

function ChatComponent() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [search, setSearch] = useState("");
    const [receiverId, setReceiverId] = useState(users ? users[0]?._id : "");
    const [visibility, setVisibility] = useState("hidden");
    const [user, setUser] = useState<any>({});
    const [socket, setSocket] = useState<Socket | null>(null); // Socket state
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [toggle, setToggle] = useState<boolean>(true);
    const socketConfig = useContext(SocketContext);
    const [width, setWidth] = useState(window.innerWidth);
    const [reload,setReload]=useState(false)


    
    useEffect(() => {
        if (window.innerWidth < 700) {
            setToggle(false);
        }
       
        if (window.innerWidth > 700) setToggle(true);
    }, [user, width]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value==''){setReload(!reload)}
        else{
            setSearch(e.target.value);
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const newTimeout = setTimeout(async () => {
            const res = await searchUserForChat(e.target.value);

           if(e.target.value!=='') setUsers(res?.data?.result);
        }, 1000);
        setDebounceTimeout(newTimeout);  
        }
      
    };
    useEffect(() => {
        const newSocket = socketConfig;
        setSocket(newSocket);
        return () => {
            if (socketConfig) newSocket.emit("updateOnline", userData._id);
        };
    }, [socketConfig]); // Empty dependency array ensures this runs only on the initial render




    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    // Function to run when the width exceeds 700px
    const handleResize = () => {
        const currentWidth = window.innerWidth;
        setInnerWidth(currentWidth);

        // If the width becomes larger than 700px, perform an action
        if (currentWidth > 700) {
           setToggle(true)
        }
    };


    useEffect(() => {
        // Set up resize event listener
        window.addEventListener("resize", handleResize);

        // Initial check if the window is already larger than 700px on load
        if (window.innerWidth > 700) {
   
        }

        // Cleanup listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);


















    return (
        <div className="md:w-[75%] w-[100%] h-[82%] md:h-full  flex justify-center items-center  ">
            <div className="w-[95%] h-[95%]  bg-[white] rounded-md flex flex-row" style={{ boxShadow: "1px 1px 5px black" }}>
                {toggle && (
                    <div className={`chatlist w-[100%] md:w-[30%] `}>
                        <div className="flex flex-row   ">
                            <h1 className=" font-semibold text-[22px] ml-6 mt-2">Chats</h1>
                        </div>

                        <div className="w-full flex justify-center ">
                            <input
                                type="text"
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Search"
                                className="border mb-2 w-[90%] rounded-lg mt-5 bg-[#F3F4F6] h-[35px]"
                            />
                        </div>
                        {
                            <UserList
                                users={users}
                                setUsers={setUsers}
                                setUser={setUser}
                                receiverId={receiverId}
                                setReceiverId={setReceiverId}
                                socket={socket}
                                visibility={visibility}
                                reload={reload}
                            />
                        }
                    </div>
                )}

                <div className={`${toggle ? "hidden" : ""} md:block w-[100%] md:w-[70%] rounded-xl search h-full`}>
                    {receiverId && socket ? (
                        <Message user={user} receiverId={receiverId} setReceiverId={setReceiverId} socket={socket} setToggle={setToggle} />
                    ) : (
                        <div className="flex items-center justify-center h-full border border-2">
                            <div className="text-center">
                                <img src={noChatImage} className="mx-auto mb-4" />
                                <h1 className="text-2xl font-bold mb-2">No Chat Selected</h1>
                                <p className="text-gray-500">Select a chat from the list to start messaging.</p>
                                <p className="text-gray-400 text-sm mt-2">Messages are end-to-end encrypted.</p>
                                <Button variant="contained" color="secondary" onClick={()=>setToggle(true)}>Start Messaging</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
