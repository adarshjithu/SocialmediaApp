import { useContext, useEffect } from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import SideBar from "../../../Components/SideBar/SideBar";
import RightSidebar from "../../../Components/RightSidebar/RightSidebar";
import Footer from "../../../Components/Footer/Footer";
import { colorContext } from "../../../Context/colorContext";

import NotificationComponent from "../../../Components/NotificationComponent/NotificationComponent";
import { ThemeInterface } from "../../../Components/ThemeHandler/Themes";

function Notification() {
    const theme: ThemeInterface = useContext(colorContext);

    useEffect(() => {
        document.title = "Notification";
    }, []);
    return (
        <>
            <Navbar />
            <div
                className="flex flex-row w-full h-screen   "
                style={{ overflow: "hidden", position: "fixed", top: "10", backgroundColor: `${theme.theme}` }}
            >
                <SideBar />
                <NotificationComponent />
                <RightSidebar />*
            </div>

            <Footer />
        </>
    );
}

export default Notification;
