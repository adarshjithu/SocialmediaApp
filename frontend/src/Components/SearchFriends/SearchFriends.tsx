import React, { useState, useEffect, useContext } from "react";
import { followUser, searchUser, unFollowUser } from "../../Services/apiService/userService";
import { noUserImage } from "../../Utils/utils";
import { colorContext } from "../../Context/colorContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { clearAllRecentSearch, deleteSearch, setRecentSearch } from "../../features/user/searchSlice";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../features/user/profileSlice";
import { SocketContext } from "../../Context/SocketProvider";

function SearchFriends() {
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const theme: any = useContext(colorContext);
    const dispatch = useDispatch();
    const recent = useSelector((data: RootState) => data.search.recent)
    const navigate =  useNavigate()
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const socket = useContext(SocketContext)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setLoading(true);

        // Clear the previous debounce timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new timeout for debouncing
        const newTimeout = setTimeout(async () => {
            if (e.target.value === "") {
                setResults([]);
                setLoading(false);
            } else {
                const res = await searchUser(e.target.value);
                setResults(res?.result);
                dispatch(setRecentSearch(res?.result));
                setLoading(false);
            }
        }, 500); // 500ms delay before making the API call

        setDebounceTimeout(newTimeout);
    };

    // Follow User
    const follow = async (userId: string) => {
        if(socket){socket.emit('notification',{type:'follow',user:userData,receiverId:userId})}
        setResults(
            results.map((obj: any) => {
                if (obj._id === userId) {
                    return { ...obj, isFollowing: !obj.isFollowing };
                }
                return obj;
            })
        );
        await followUser(userId);
    };

    // Unfollow user 
    const unfollow = async (userId: string) => {
        if(socket){socket.emit('notification',{type:'unfollow',user:userData,receiverId:userId})}
        setResults(
            results.map((obj: any) => {
                if (obj._id == userId) return { ...obj, isFollowing: !obj.isFollowing };
                return obj;
            })
        );
        await unFollowUser(userId);
    };


    // Delete recent search
    const deleteRecent = (id: string) => {
        dispatch(deleteSearch(id));
    };

    // Clear all the recent search
    const clearAllRecent = ()=>{
        dispatch(clearAllRecentSearch())
    }

    const viewProfile =  (userId:string)=>{
       dispatch(setCurrentUser({status:false,userId:userId}));
       navigate('/profile')
    }

    return (
        <div className="w-[100%] md:w-[50%] border border-gray  rounded-lg">
            <div className=" p-6 rounded-lg  w-full max-w-xl mx-auto mt-6">
                {/* Search Bar */}
                <h1 className="text-2xl mb-4 font-medium">Search</h1>
                <div className="mb-4">
                    <input
                        value={search}
                        onChange={(e) => handleSearch(e)}
                        type="text"
                        placeholder="Search..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Loading Spinner */}
                <div className="w-full flex justify-center items-center">
                    {loading ? <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" /> : ""}
                </div>

                {/* Search Results */}
                {results?.map((obj, index) => {
                    return (
                        <div className="space-y-4" key={index}>
                            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        onClick={()=>viewProfile(obj._id)}
                                        src={`${obj.image ? obj.image : noUserImage}`}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover cursor-pointer"
                                    />
                                    <p className="font-semibold">{obj.name}</p>
                                </div>
                                {obj.isFollowing ? (
                                    <button
                                        className=" text-white px-4 py-1 rounded-lg text-sm"
                                        onClick={() => unfollow(obj._id)}
                                        style={{ backgroundColor: `${theme.normalButton.backgroundColor}` }}
                                    >
                                        UnFollow
                                    </button>
                                ) : (
                                    <button
                                        className="text-white px-4 py-1 rounded-lg text-sm"
                                        onClick={() => follow(obj._id)}
                                        style={{ backgroundColor: `${theme.normalButton.backgroundColor}` }}
                                    >
                                        Follow
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* recent searches */}
                {results.length == 0 && (
                    <>
                        <div className="p-2 flex flex-row justify-between cursor-pointer">
                            <h1 className="mb-2">{recent.length == 0 ? "No Recent search" : "Recent"} </h1>
                            <h1 onClick={clearAllRecent}>Clear All</h1>
                        </div>
                        {/* {recent?.map((obj: any, index: number) => {
                            return (
                                <div className="space-y-4" key={index}>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={`${obj.image ? obj.image : noUserImage}`}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <p className="font-semibold">{obj.name}</p>
                                        </div>

                                        <div className="flex flex-row">
                                            {obj.isFollowing ? (
                                                <button
                                                    className=" text-white px-4 py-1 rounded-lg text-sm"
                                                    onClick={() => unfollow(obj._id)}
                                                    style={{ backgroundColor: `${theme.normalButton.backgroundColor}` }}
                                                >
                                                    UnFollow
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-white px-4 py-1 rounded-lg text-sm"
                                                    onClick={() => follow(obj._id)}
                                                    style={{ backgroundColor: `${theme.normalButton.backgroundColor}` }}
                                                >
                                                    Follow
                                                </button>
                                            )}

                                            <div>
                                                <i onClick={() => deleteRecent(obj._id)} className="fa-solid fa-xl ml-4 fa-xmark"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })} */}
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchFriends;
