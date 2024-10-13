import React, { useEffect, useState } from "react";
import SingleNotification from "./SingleNotification";
import { clearAllNotification, getAllNotification, readAllNotification, showMoreNotification } from "../../Services/apiService/userService";
import { isToday } from "../../Utils/utils";
import { LoadingComponentTaiwind } from "../Loading/LoadingComponent";
import EmptyNotification from "./EmptyNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons"; // Import the ellipsis icon
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { addNotificationCount } from "../../features/user/notification";

const NotificationComponent = () => {
    const [notification, setNotification] = useState<any[]>([]);
    const [today, setToday] = useState<any>([]);
    const [month, setMonth] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState<boolean>(false); // State for toggling button visibility
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(0);
    const dispatch = useDispatch()

    const countNotification = (arr: Record<string, any>[]) => {
        let count = 0;
        arr.forEach((data) => {
            if (data.notifications.isViewed == false) {
                count++;
            }
        });

        return count;
    };

    // For clear all the notification
    const clearNotification = async () => {
        const res = await clearAllNotification();
        dispatch(addNotificationCount(0))
        if (res.success) {
            setMonth([]);
            setToday([]);
        }
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const res = await getAllNotification(page);
            setLoading(false);
            setNotification(res?.result);
            const allToday: any = [];
            const allMonth: any = [];
            res?.result.forEach((data: any) => {
                if (isToday(data.notifications.createdAt)) {
                    allToday.push(data);
                } else {
                    allMonth.push(data);
                }
            });
            setToday(allToday);
            setMonth(allMonth);
        };
        fetchData();
    }, []);

    // Show more

    const showMore = async () => {
        const res = await showMoreNotification(page + 1);
        setNotification([...notification, ...res?.result]);
        const allToday: any = [];
        const allMonth: any = [];
        res?.result.forEach((data: any) => {
            if (isToday(data.notifications.createdAt)) {
                allToday.push(data);
            } else {
                allMonth.push(data);
            }
        });
        setToday([...today, ...allToday]);
        setMonth([...month, ...allMonth]);
        setPage(page + 1);
    };

    const readAllNotifications = async () => {
        setToday(
            today.map((obj: any) => {
                obj.notifications.isViewed = true;
                return obj;
            })
        );
        setMonth(
            month.map((obj: any) => {
                obj.notifications.isViewed = true;
                return obj;
            })
        );
      
        await readAllNotification();
        dispatch(addNotificationCount(0))
    };

    return loading ? (
        <div className="w-[90%] md:w-[50%] mt-2 p-4 flex justify-center items-center min-h-[200px]">
            <LoadingComponentTaiwind />
        </div>
    ) : (
        <div
            className="h-[80%] md:h-full bg-white w-full md:w-[50%] mt-2 p-4 overflow-scroll shadow-lg rounded-lg border border-gray-300"
            style={{ scrollbarWidth: "none" }}
        >
            {month.length === 0 && today.length === 0 ? (
                <EmptyNotification />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-semibold text-[#4B164C] ml-2">New notifications ({countNotification(notification)}) </h1>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faEllipsisV}
                                className="cursor-pointer text-gray-700 hover:text-gray-900"
                                onClick={() => setShowOptions(!showOptions)} // Toggle options on click
                            />
                            {showOptions && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                    <div
                                        onClick={clearNotification}
                                        className="cursor-pointer text-red-500 hover:bg-gray-100 p-2 text-center transition duration-200"
                                    >
                                        Clear All
                                    </div>
                                    <div
                                        onClick={readAllNotifications}
                                        className="cursor-pointer text-blue-500 hover:bg-gray-100 p-2 text-center transition duration-200"
                                    >
                                        Read All
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold ml-2 mt-4 text-[#4B164C]">Today</h2>
                        <div className="border-t border-[#4B164C] mt-2" style={{ opacity: "0.5" }}></div>
                    </div>

                    {today?.map((obj: any, index: number) => (
                        <div
                            key={index}
                            className="mt-2 p-2 rounded-lg shadow hover:shadow-lg transition duration-200 transform hover:-translate-y-1"
                        >
                            <SingleNotification data={obj} />
                        </div>
                    ))}
                    {month?.map((obj: any, index: number) => (
                        <div
                            key={index}
                            className="mt-2 p-2 rounded-lg shadow hover:shadow-lg transition duration-200 transform hover:-translate-y-1"
                        >
                            <SingleNotification data={obj} />
                        </div>
                    ))}
                </>
            )}
            <div className="w-full flex justify-center items-center">
                {notification.length < 10 ? (
                    ""
                ) : (
                    <Button onClick={showMore} variant="contained" color="secondary">
                        Show more
                    </Button>
                )}
            </div>
        </div>
    );
};

export default NotificationComponent;
