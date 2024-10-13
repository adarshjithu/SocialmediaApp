import React, { useEffect, useState } from "react";
import { noUserImage } from "../../Utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { followUser, getAllFollowersInfo, unFollowUser } from "../../Services/apiService/userService";
import { IUser } from "../../interfaces/Interface";

function FollowComponent() {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const isCurrentUser = useSelector((data: RootState) => data.profile.isCurrentUser);
    const [follower, setFollower] = useState<any[]>([]);


    const follow = async (obj: any) => {
        await followUser(obj._id);
        setFollower(
            follower.map((data) => {
                if (data._id == obj._id) {
                    data.isFollowing = !data.isFollowing;
                }
                return data;
            })
        );
    };

    const unfollow = async (obj: any) => {
        await unFollowUser(obj._id);
        setFollower(
            follower.map((data) => {
                if (data._id == obj._id) {
                    data.isFollowing = !data.isFollowing;
                }
                return data;
            })
        );
    };
    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllFollowersInfo(isCurrentUser);
            setFollower(res?.result);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 onClick={() => setOpenModal(true)}>Followers <span className="ml-1">{follower.length}</span></h1>
            {openModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-gray-800">Followers</h2>

                        {/* FollowList */}

                        {follower.map((obj: any) => {
                            return (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
                                            src={obj.image ? obj.image : noUserImage}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm sm:text-lg font-semibold text-gray-800">{obj?.name}</p>
                                        </div>
                                        {isCurrentUser?.status && (
                                            <button className="py-1 px-2 text-xs sm:text-sm font-semibold text-white  rounded-md  transition duration-300 bg-[#4B164C]">
                                                Remove
                                            </button>
                                        )}

                                    {!isCurrentUser&&  <>  ({obj.isFollowing ? (
                                            <button onClick={()=>follow(obj)} className="px-2 py-1 text-xs sm:text-sm font-semibold text-white  rounded-md transition duration-300" style={{color:"#4B164C" ,border:"1px solid #4B164C"}}>
                                                Unfollow
                                            </button>
                                        ) : (
                                            <button onClick={()=>unfollow(obj)} className="px-2 py-1  text-xs sm:text-sm font-semibold text-white rounded-md transition duration-300" style={{backgroundColor:"#31223F"}}>
                                                Follow
                                            </button>
                                        )})</>}
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="mt-4 px-2 bg-[red] text-white py-1  text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
                            onClick={() => setOpenModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FollowComponent;
