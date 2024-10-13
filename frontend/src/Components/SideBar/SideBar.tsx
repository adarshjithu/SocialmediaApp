import React, { useContext, useState, useEffect } from "react";
import { colorContext } from "../../Context/colorContext";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getNotifications } from "../../Services/apiService/userService";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../features/user/profileSlice";
import { isUploadFeedback } from "../../features/post/status";
import { RootState } from "../../app/store";
import { noUserImage } from "../../Utils/utils";

export interface createPost {
    create: boolean;
    setCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = () => {
    const theme: any = useContext(colorContext);
    const [hover, setHover] = useState<number>(0);
    const [selected, setSelected] = useState<string>("home");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const feedbackStatus = useSelector((data: RootState) => data.status.isUploadFeedback);
    const user= useSelector((data:RootState)=>data.auth.userData)

    const notificationCount = useSelector((data:RootState)=>data.notification.notificationCount)
    const feedback = () => {
        dispatch(isUploadFeedback(!feedbackStatus));
    };

    const setIsCurrentUser = () => {
        dispatch(setCurrentUser({ status: true, userId: null }));
    };

    return (
        <div className="w-[25%] h-[90vh] sidebar sticky top-0">
            <ul className="ul w-[85%] h-full  p-6 border border-1 ">
                <li
                    onClick={() => {
                        setSelected("home");
                        navigate("/");
                        setIsCurrentUser();
                    }}
                    className=" h-[40px] rounded font-medium list cursor-pointer" 
                    onMouseOver={() => setHover(1)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 1 || selected == "home" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    <i className="fa-regular fa-bell fa-lg p-5 icon" style={{ color: `${hover == 1 ? "white" : theme.sidebar.iconColor}` }}></i>
                    <span
                        style={{
                            color: `${hover == 1 || selected == "home" ? "white" : theme.sidebar.textColor}`,
                            fontSize: "18px",
                            cursor: "pointer",
                        }}
                    >
                        Home
                    </span>
                </li>
                <li
                    onClick={() => {
                        setSelected("message");
                        navigate("/messages");
                    }}
                    className="bg-[] h-[40px] rounded font-medium cursor-pointer"
                    onMouseOver={() => setHover(2)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 2 || selected == "message" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    <i
                        className="fa-solid fa-message fa-lg p-5"
                        style={{ color: `${hover == 2 || selected == "message" ? "white" : theme.sidebar.iconColor}` }}
                    ></i>
                    <span style={{ color: `${hover == 2 || selected == "message" ? "white" : theme.sidebar.textColor}`, fontSize: "18px" }}>
                        Message
                    </span>
                </li>

                <li
                    onClick={() => {
                        setSelected("search");
                        navigate("/search");
                        setIsCurrentUser();
                    }}
                    className="bg-[] h-[40px] rounded font-medium  cursor-pointer"
                    onMouseOver={() => setHover(3)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 3 || selected == "search" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    <i
                        className="fa-magnifying-glass fa-solid fa-lg p-5"
                        style={{ color: `${hover == 3 || selected == "search" ? "white" : theme.sidebar.iconColor}` }}
                    ></i>
                    <span style={{ color: `${hover == 3 || selected == "search" ? "white" : theme.sidebar.textColor}`, fontSize: "18px" }}>
                        Search
                    </span>
                </li>
                <li
                    onClick={() => {
                        setSelected("notification");
                        navigate("/notification");
                        setIsCurrentUser();
                    }}
                    className="bg-[] h-[40px] rounded font-medium cursor-pointer "
                    onMouseOver={() => setHover(4)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 4 || selected == "notification" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    
            <Badge badgeContent={notificationCount} showZero color="error" overlap="circular" style={{marginLeft:"10px",marginRight:"10px"}}>
                <NotificationsIcon style={{ fontSize: '30px', cursor: 'pointer' ,color:"#4B164C"}} />
            </Badge>
        
                    <span style={{ color: `${hover == 4 || selected == "notification" ? "white" : theme.sidebar.textColor}`, fontSize: "18px" }}>
                        Notification
                    </span>
                 
                </li>
                <li
                    onClick={() => {
                        setSelected("create");
                        navigate("/create");
                        setIsCurrentUser();
                    }}
                    className="bg-[] h-[40px] rounded font-medium cursor-pointer"
                    onMouseOver={() => setHover(5)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 5 || selected == "create" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    <i
                        className="fa-solid fa-plus fa-lg p-5"
                        style={{ color: `${hover == 5 || selected == "create" ? "white" : theme.sidebar.iconColor}` }}
                    ></i>
                    <span style={{ color: `${hover == 5 || selected == "create" ? "white" : theme.sidebar.textColor}`, fontSize: "18px" }}>
                        Create
                    </span>
                </li>
                <li
                    onClick={() => {
                        setSelected("request");
                        navigate("/requests");
                        setIsCurrentUser();
                    }}
                    className="bg-[] h-[40px] rounded font-medium cursor-pointer"
                    onMouseOver={() => setHover(6)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 6 || selected == "request" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    <i
                        className="fa-solid fa-user-group fa-lg p-5"
                        style={{ color: `${hover == 6 || selected == "request" ? "white" : theme.sidebar.iconColor}` }}
                    ></i>
                    <span style={{ color: `${hover == 6 || selected == "request" ? "white" : theme.sidebar.textColor}`, fontSize: "18px" }}>
                        Request
                    </span>
                </li>
                <li
                    onClick={() => {
                        setSelected("profile");
                        navigate("/profile");
                        dispatch(setCurrentUser({ status: true, userId: null }));
                        location.reload();
                        navigate("/profile");
                    }}
                    className="bg-[] p-1 h-[40px] rounded font-medium cursor-pointer flex flex-row "
                    onMouseOver={() => setHover(7)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 7 || selected == "profile" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    <div >

                    <img className="w-[30px] h-[30px] rounded-full ml-2 mr-6" src={`${user?.image?user.image:noUserImage}`} alt="" />
                    </div>
                    <span style={{ color: `${hover == 7 || selected == "profile" ? "white" : theme.sidebar.textColor}`, fontSize: "18px" }}>
                        Profile
                    </span>
                </li>

                <li
                    onClick={() => {
                        setSelected("chatbot"), navigate("/bot");
                    }}
                    className="bg-[] h-[40px] rounded font-medium cursor-pointer "
                    onMouseOver={() => setHover(8)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 8 || selected == "chatbot" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    <i
                        className="fa-solid fa-robot fa-lg p-5"
                        style={{ color: `${hover == 8 || selected == "chatbot" ? "white" : theme.sidebar.iconColor}` }}
                    ></i>
                    <span style={{ color: `${hover == 8 || selected == "chatbot" ? "white" : theme.sidebar.textColor}`, fontSize: "18px" }}>
                        AI Chatbot
                    </span>
                </li>

                <li
                    onClick={() => setSelected("settings")}
                    className="bg-[] h-[40px] rounded font-medium cursor-pointer"
                    onMouseOver={() => setHover(9)}
                    onMouseLeave={() => setHover(0)}
                    style={{ backgroundColor: `${hover == 9 || selected == "settings" ? theme.themeColor.backgroundColor : "white"}` }}
                >
                    <i
                        className="fa-solid fa-book fa-lg p-5"
                        style={{ color: `${hover == 9 || selected == "settings" ? "white" : theme.sidebar.iconColor}` }}
                    ></i>
                    <span
                        onClick={feedback}
                        style={{ color: `${hover == 9 || selected == "settings" ? "white" : theme.sidebar.textColor}`, fontSize: "18px" }}
                    >
                        Feedback
                    </span>
                </li>
          
            </ul>
            
        </div>
    );
};

export default SideBar;
