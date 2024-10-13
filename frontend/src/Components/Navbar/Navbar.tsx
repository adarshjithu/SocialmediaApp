import React, { useContext, useEffect } from "react";
import { colorContext } from "../../Context/colorContext";
import Icon from "../../Components/Icon/Icon";
import { TextField } from "@mui/material";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { noUserImage } from "../../Utils/utils";
import { RootState } from "../../app/store";
import { setCurrentUser } from "../../features/user/profileSlice";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getNotificationCount } from "../../Services/apiService/userService";
import { addNotificationCount } from "../../features/user/notification";
import { SocketContext } from "../../Context/SocketProvider";
function Navbar() {
    const theme: any = useContext(colorContext);
    const user = useSelector((data: RootState) => data.auth.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const notificationCount = useSelector((data:RootState)=>data.notification.notificationCount)
  
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }

        
    }, [user]);

    const setIsCurrentUser = () => {
        dispatch(setCurrentUser({ status: true, userId: null }));
    };

    useEffect(()=>{
     const fetchData = async()=>{
         const res = await getNotificationCount()
         console.log(res)
         dispatch(addNotificationCount(res?.result?.count))

     }
     fetchData()
    },[])
    return (
        <div className={`md:hidden sticky top-0  w-[100%] h-[11vh] flex flex-row`} style={{ backgroundColor: `${theme.themeColor.backgroundColor}` }}>
            <div className="leftnav cursor-pointer " onClick={() => navigate("/")}>
                <Icon />
            </div>
            <div className="middlenav">
                <TextField label="Search for Friends" sx={{ width: "100%", backgroundColor: "white" }} size="small" className="rounded" />
            </div>

            <div className="rightnav">
                <div className="r-icons ">
                    <div
                        onClick={() => navigate("/messages")}
                        className="h-[60%] w-[35px] cursor-pointer  rounded-[100%] mr-1 md:mr-4 md:h-[80%] flex justify-center items-center"
                    >
                        <i className="fa-solid fa-message fa-lg" style={{ color: "white" }}></i>
                    </div>
                    <div
                        onClick={() => navigate("/notification")}
                        className="h-[60%] curor-pointer w-[35px]  rounded-[100%] mr-1 md:mr-4 md:h-[80%] flex justify-center items-center"
                    >
                        <Badge badgeContent={Number(notificationCount)} color="error" overlap="circular" style={{ marginLeft: "10px", marginRight: "10px" }}>
                            <NotificationsIcon style={{ fontSize: "30px", cursor: "pointer",color:"white" }} />
                        </Badge>
                    </div>
                    <div onClick={() => navigate("/bot")} className="cursor-pointer h-[60%] w-[35px]  rounded-[100%] mr-1 md:mr-4 md:h-[80%]">
                        <i className="fa-solid fa-robot fa-xl" style={{ color: "white" }}></i>
                    </div>
                    <div
                        className="h-[60%] cursor-pointer    rounded-[100%] mr-1 md:mr-4 md:h-[80%] flex justify-center items-center"
                        style={{ backgroundColor: `${theme.navbarIcon.backgroundColor}` }}
                    >
                        <img
                            onClick={() => navigate("/profile")}
                            className="cursor-pointer  h-full rounded-full"
                            src={`${user?.image ? user.image : noUserImage}`}
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
