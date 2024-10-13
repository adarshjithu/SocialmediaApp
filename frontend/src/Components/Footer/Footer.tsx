import React, { useContext, useState } from "react";
import "./Footer.css";
import { colorContext } from "../../Context/colorContext";

import { ThemeInterface } from "../ThemeHandler/Themes";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { isUploadFeedback } from "../../features/post/status";
function Footer(props: any) {
    const theme: ThemeInterface = useContext(colorContext);
    const [hover, setHover] = useState(0);
    const navigate = useNavigate();
    const feedbackStatus = useSelector((data: RootState) => data.status.isUploadFeedback);
    const dispatch = useDispatch()
    const location = useLocation()
    console.log(location.pathname)
    const feedback = () => {
        dispatch(isUploadFeedback(!feedbackStatus));
    };
    const handleHover = (id: any) => {
        setHover(id);
    };
    const handleMouseLeave = () => {
        setHover(0);
    };

    return (
        location.pathname=='/messages'?'':
        <div className="footer-class">
            <div onClick={() => navigate("/")} style={{ backgroundColor: `${hover == 1 ? theme.themeColor.backgroundColor : ""}` }}>
                <i
                    className="fa-solid fa-house fa-lg p-5 icon"
                    style={{ color: `${hover == 1 ? "white" : theme.sidebar.iconColor}` }}
                    onMouseEnter={() => handleHover(1)}
                    onMouseLeave={handleMouseLeave}
                ></i>
            </div>
            <div onClick={() => navigate("/create")} style={{ backgroundColor: `${hover == 2 ? theme.themeColor.backgroundColor : ""}` }}>
                <i
                    className="fa-solid fa-plus fa-lg p-5 icon"
                    style={{ color: `${hover == 2 ? "white" : theme.sidebar.iconColor}` }}
                    onMouseEnter={() => handleHover(2)}
                    onMouseLeave={handleMouseLeave}
                ></i>
            </div>

            <div onClick={() => navigate("/suggessions")} style={{ backgroundColor: `${hover == 5 ? theme.themeColor.backgroundColor : ""}` }}>
                <i
                    className="fa-solid fa-user-plus fa-lg p-5 icon"
                    style={{ color: `${hover == 5 ? "white" : theme.sidebar.iconColor}` }}
                    onMouseEnter={() => handleHover(5)}
                    onMouseLeave={handleMouseLeave}
                ></i>
            </div>
            <div onClick={() => navigate("/search")} style={{ backgroundColor: `${hover == 4 ? theme.themeColor.backgroundColor : ""}` }}>
                <i
                    className="fa-solid fa-magnifying-glass fa-lg p-5 icon"
                    style={{ color: `${hover == 4 ? "white" : theme.sidebar.iconColor}` }}
                    onMouseEnter={() => handleHover(4)}
                    onMouseLeave={handleMouseLeave}
                ></i>
            </div>

            <div onClick={() => navigate("/requests")} style={{ backgroundColor: `${hover == 3 ? theme.themeColor.backgroundColor : ""}` }}>
                <i
                    className="fa-solid fa-arrow-down fa-lg p-5 icon"
                    style={{ color: `${hover == 3 ? "white" : theme.sidebar.iconColor}` }}
                    onMouseEnter={() => handleHover(3)}
                    onMouseLeave={handleMouseLeave}
                ></i>
            </div>

            <div onClick={feedback} style={{ backgroundColor: `${hover == 6 ? theme.themeColor.backgroundColor : ""}` }}>
                <i
                    className="fa-book fa-solid fa-lg p-5 icon"
                    style={{ color: `${hover == 6 ? "white" : theme.sidebar.iconColor}` }}
                    onMouseEnter={() => handleHover(6)}
                    onMouseLeave={handleMouseLeave}
                ></i>
            </div>
        </div>
    );
}

export default Footer;
