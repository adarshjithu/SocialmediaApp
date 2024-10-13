import React, { useContext, useEffect, useState } from "react";
import { getDayDifference, noUserImage } from "../../Utils/utils"; // Assume you have a default image utility
import { colorContext } from "../../Context/colorContext";
import { acceptFollowRequest, getAllRequests, rejectFollowRequest } from "../../Services/apiService/userService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { setAllRequests } from "../../features/user/requests";
import EmptyFriendRequest from "./EmptyRequest";
import { LoadingComponentTaiwind } from "../Loading/LoadingComponent";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../features/user/profileSlice";


const RequestList = () => {
    const theme: any = useContext(colorContext);
    const [loading, setLoading] = useState<boolean>(false);
    const requests = useSelector((data: RootState) => data.requests.requests);
    const dispatch = useDispatch();
    const [reload,setReload] = useState<boolean>(false);
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            setLoading(false);
            const res = await getAllRequests();
            dispatch(setAllRequests(res?.result.requests));
        };

        fetchData();
    }, [reload]);

    const acceptFollow = async (id: string, name: string) => {
        const res = await acceptFollowRequest(id);
        if (res.success) {
           
            toast.success(`You are currently following ${name}`);
            setReload(!reload)
        }
    };

    const rejectFollow = async (id: string, name: string) => {
        const res = await rejectFollowRequest(id);
        if (res.success) {
            
            toast.success(`You declined ${name} s Request`);
            setReload(!reload)
        }
    };

    // Function for view user of the requested user
    const viewProfile = (userId:string) => {
        dispatch(setCurrentUser({status:false,userId:userId}));
        navigate("/profile")
    }

    return (
        <div className="p-4 mt-4 rounded-lg shadow-lg space-y-6 overflow-auto flex flex-col items-center w-[80%] md:w-[40%] mx-auto ">
            {/* Heading with request count and Show All button */}
            {loading ? <LoadingComponentTaiwind /> : requests.length == 0 && <EmptyFriendRequest />}
            {requests.length !== 0 && (
                <>
                    <div className="flex flex-col items-start w-full">
                        <div className="flex items-center justify-between w-full mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Follow Requests</h2>
                            <div className="flex space-x-4 items-center">
                                <span className="text-md text-gray-600">Total: {requests.length}</span>
                                <button
                                    className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg`}
                                    style={{ backgroundColor: `${theme.themeColor.backgroundColor}` }}
                                >
                                    Show All
                                </button>
                            </div>
                        </div>
                        {/* Horizontal line */}
                        <div className="w-full border-b-2 border-gray-300 mb-4"></div>
                    </div>

                    {requests?.map((data: any, index: number) => (
                        <div
                            key={index}
                            className="flex items-center bg-white w-full md:w-[80%] justify-between p-3 rounded-lg shadow-sm transform hover:scale-105 transition duration-300 ease-in-out"
                        >
                            {/* Profile section */}
                            <div className="flex items-center space-x-4">
                                <img
                                    onClick={()=>viewProfile(data.userId._id)}
                                    src={data.image ? data.image : noUserImage} // Replace with dynamic image
                                    alt="Profile"
                                    className="w-10 cursor-pointer h-10 rounded-full object-cover border-2 border-gray-300"
                                />
                                <div>
                                    <h3 className="text-md font-semibold text-gray-800">{data?.userId.name}</h3> {/* Replace with dynamic name */}
                                    <p className="text-xs text-gray-500">{getDayDifference(data.requestedAt)}</p> {/* Replace with dynamic time */}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => acceptFollow(data.userId._id, data.userId.name)}
                                    className={`px-4 py-1 text-xs bg-[green] font-semibold text-white rounded-full transition duration-300`}
                                >
                                    <i className="fas fa-check mr-2"></i> Accept
                                </button>
                                <button
                                    onClick={() => rejectFollow(data.userId._id, data.userId.name)}
                                    className="px-4 py-1 bg-red-500 text-xs text-white font-semibold rounded-full transition duration-300 hover:bg-red-600"
                                    style={{ backgroundColor: `${theme.themeColor.backgroundColor}` }}
                                >
                                    <i className="fas fa-times mr-2"></i> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default RequestList;
