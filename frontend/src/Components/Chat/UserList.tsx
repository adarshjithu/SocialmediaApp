import React, { useEffect, useState } from "react";
import { getAllChatedUsers } from "../../Services/apiService/chatServices";
import { getChatUserListTime, noUserImage } from "../../Utils/utils";
import { LoadingComponentTailwind1 } from "../Loading/LoadingComponent";

const UserList: React.FC<any> = ({ users, setUser, setUsers, receiverId, setReceiverId, visibility, setVisibility, setToggle, reload }) => {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getAllChatedUsers();
            setLoading(false);
            setUsers(res?.data?.result);
        };
        fetchData();
    }, [setUsers, reload]);

    return (
        <div className="w-full overflow-y-scroll  bg-white shadow-lg  scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {loading ? (
                <LoadingComponentTailwind1 />
            ) : (
                <>
                    {users?.map((user: any) => {
                        return (
                            <div
                                onClick={() => {
                                    setReceiverId(user._id);

                                    setUser(user);
                                }}
                                key={user?._id}
                                className={`flex items-center border w-full h-[70px] justify-between p-2 ${
                                    receiverId == user._id ? "bg-[#F0F0F0]" : ""
                                }  `}
                            >
                                <div className="flex items-center w-full ]">
                                    <div className="w-[15%]">
                                        <img
                                            src={user?.otherUser?.image ? user.otherUser.image : user.image || noUserImage}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                    </div>
                                    <div className="ml-3 w-[55%]">
                                        <div className="flex flex-col">
                                            <span className={`font-semibold`}>
                                                {user?.otherUser?.name ? user?.otherUser?.name : user?.name ? user?.name : ""}
                                            </span>
                                            <span className={`text-sm truncate ${receiverId === user._id ? "text-gray-600" : "text-gray-600"}`}>
                                                {user?.lastMessage?.message && user.lastMessage.message}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-[20%] text-right">
                                        <span className={`text-xs font-medium ${receiverId === user._id ? "text-gray-600" : "text-gray-500"}`}>
                                            {user?.lastMessage ? getChatUserListTime(user?.lastMessage?.timestamp) : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default UserList;
