import React, { useContext } from "react";
import { getDayDifference, noUserImage, setNotificationMessages } from "../../Utils/utils";
import { colorContext } from "../../Context/colorContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../features/user/profileSlice";

export default function SingleNotification({ data }: any) {
    // Global theme
    const theme: any = useContext(colorContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function for viewing the profile of the user
    const viewProfile = (userId: string) => {
        dispatch(setCurrentUser({ status: false, userId: userId }));
        navigate("/profile");
    };

const read = data?.notifications.isViewed;

    return (
        <div className={`flex flex-col p-4 rounded-lg transition duration-200 relative ${read ? 'bg-white text-gray-800' : 'bg-blue-100 text-gray-900'}`}>
            <div className="absolute right-0 top-0">

            </div>
            <div className="flex items-center">
                {/* User Image */}
                <img
                    onClick={() => viewProfile(data.userData[0]._id)}
                    src={`${data.userData[0].image ? data.userData[0].image : noUserImage}`}
                    alt="User Profile"
                    className="w-12 cursor-pointer h-12 rounded-full object-cover mr-4"
                />

                <div className="flex-grow">
                    <p className="text-gray-800">
                        {/* Name of User */}
                        <span className="font-semibold">{data.userData[0].name}</span>
                        {/* Notification Message */}
                        <span className="ml-4">{setNotificationMessages(data?.notifications.message)}</span>

                        {/* Icons for notification type */}
                        {(data?.notifications.message === "like" || data?.notifications.message === "like comment") && (
                            <i className="fa-solid ml-2 fa-heart" style={{ color: "#ff0000" }}></i>
                        )}
                        {data?.notifications.message === "follow accept" && (
                            <i className="fa-solid fa-check fa-xl ml-4" style={{ color: "#13f702" }}></i>
                        )}
                    </p>

                    {/* Time */}
                    <span className="text-sm text-gray-500">{getDayDifference(data?.notifications.createdAt)}</span>

                    {/* Data of Notification */}
                    {data?.notifications.data !== "" && <span className="ml-4">{data?.notifications.data}</span>}
                </div>

                <div className="flex items-center">
                    {/* Post Image */}
                    {data?.notifications.image && (
                        <img alt="Post" className="w-[40px] h-[40px] mr-2" src={`${data?.notifications.image}`} />
                    )}
                </div>
            </div>

            {/* Read/Unread Status */}
            {/* <span className={`mt-2 text-sm ${read? 'text-green-600' : 'text-red-600'} flex justify-end`}>
                {read ? "Read" : "Unread"}
            </span> */}
        </div>
    );
}
