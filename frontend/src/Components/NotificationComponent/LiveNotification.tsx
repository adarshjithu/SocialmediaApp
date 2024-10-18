import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../Context/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { addNotificationCount } from "../../features/user/notification";

interface User {
    name: string;
}

interface NotificationData {
    user: User;
    type: string;
}

const LiveNotification = () => {
    const socket = useContext(SocketContext);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [type, setType] = useState<string>("");
    const dispatch = useDispatch();
    const notificationCount = useSelector((data: RootState) => data.notification.notificationCount);

    const getMessage = (type: string) => {
        switch (type) {
            case "like":
                return "Liked your post";
            case "comment":
                return "Commented on your post";
            case "unlike":
                return "Unliked your post";
            case "like-comment":
                return "Liked your comment";
            case "unlike-comment":
                return "Unliked your comment";
            case "follow":
                return "Started following you";
            case "unfollow":
                return "Unfollowed you";
            default:
                return "";
        }
    };

    const getEmoji = (type: string) => {
        switch (type) {
            case "like":
                return "❤️";
            case "unlike":
                return "👎";
            case "comment":
                return "💬";
            case "like-comment":
                return "❤️";
            case "unlike-comment":
                return "👎";
            case "follow":
                return "💌";
            case "unfollow":
                return "📤";
            default:
                return "";
        }
    };

    // Handle socket notification and update state
    useEffect(() => {
        if (socket) {
            socket.on("notification", (data: NotificationData) => {
                dispatch(addNotificationCount(notificationCount + 1));
                setUser(data.user);
                setType(data.type);
                setShowNotification(true); // Show the notification
            });
        }

        // Cleanup socket on component unmount
        return () => {
            if (socket) socket.off("notification");
        };
    }, [socket, notificationCount, dispatch]);

    // Auto-hide notification after a timeout
    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        if (showNotification) {
            timeout = setTimeout(() => {
                setShowNotification(false);
            }, 5000); // Hide after 2 seconds
        }

        // Clear timeout if component unmounts or notification hides early
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [showNotification]); // Only run this effect when showNotification changes

    return (
        showNotification && user && (
            <div className="fixed top-5 right-5 z-50">
                <div className="bg-white shadow-lg rounded-lg p-4 mb-4 transition-transform transform hover:scale-105">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                <div className="w-full h-full flex justify-center items-center">
                                    {getEmoji(type)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                {user.name} {getMessage(type)}
                            </p>
                            <p className="text-sm text-gray-500">Just now</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default LiveNotification;
