import React, { useContext, useEffect, useState } from "react";
import { getShare, postShare } from "../../Services/apiService/postServices";
import { noUserImage } from "../../Utils/utils";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { SocketContext } from "../../Context/SocketProvider";

function Share({ post }: any) {
    const [shareableFriends, setSharableFriends] = useState<any>([]);
    const [limit, setLimit] = useState(5);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [search, setSearch] = useState("");
    const user = useSelector((data: RootState) => data.auth.userData);
    const socket=  useContext(SocketContext);
    const [receiverId,setReceiverId] = useState<string>('')



    const toggleShareOptions = () => {
        setShowShareOptions(!showShareOptions);
    };

    const handleShare = async (friendId: string) => {
        setReceiverId(friendId)
        const receiverId = friendId;
        const message = `http://friendzy/post/link=${post._id}`
        const senderId = user?._id;

        const messageObj = {
            senderId: senderId,
            receiverId: receiverId,
            message: message,
            read: false,
            type: "link",
            file: "",
        };

        const res = await postShare(messageObj)
        if(socket){socket.emit("getAllOnlineUsers")}
    };


    useEffect(()=>{

        if(socket){
            socket.on('getAllOnlineUsers',(data:any)=>{
           
                if(receiverId){
                 if(data[receiverId]){
                    
                    if(socket){
                        socket.emit("sharepost",{
                            senderId:user?._id,
                            receiverId:receiverId,
                            message:`http://friendzy/post/link=${post._id}`,
                            status:'online',
                            type:'link',
                            file:""
                        })
                    }

                 }
                }
             
            })
        }
    },[socket,receiverId])

    useEffect(() => {
        const fetchData = async () => {
            const res = await getShare();
            setSharableFriends([...res?.data.result.following, ...res?.data.result.followers]);
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="bg-gray-100 p-2 rounded-lg mt-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-bold">Share with:</p>
                    <input
                        type="text"
                        placeholder="Search friends..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    {shareableFriends
                        .filter((friend: any) => friend.name.toLowerCase().includes(search.toLowerCase()))
                        .slice(0, limit)
                        .map((friend: any, index: number) => (
                            <div key={index} className="flex justify-between items-center mb-2">
                                <div className="flex flex-row">
                                    <img className="mr-3 w-[40px] h-[40px] rounded-full" src={friend.image ? friend.image : noUserImage} alt="" />
                                    <span>{friend.name}</span>
                                </div>
                                <button
                                    onClick={() => handleShare(friend._id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Share
                                </button>
                            </div>
                        ))}
                </div>
                <div className="w-full flex justify-center items-center">
                    {shareableFriends.length >= limit && (
                        <button onClick={() => setLimit(limit + 5)} className="text-[blue]">
                            Show More
                        </button>
                    )}
                    {shareableFriends.length <= limit && (
                        <button onClick={() => setLimit(limit - 5)} className="text-[blue]">
                            Show Less
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Share;
