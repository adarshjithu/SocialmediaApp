import { useContext, useEffect } from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import SideBar from "../../../Components/SideBar/SideBar";
import RightSidebar from "../../../Components/RightSidebar/RightSidebar";
import Footer from "../../../Components/Footer/Footer";
import { colorContext } from "../../../Context/colorContext";

import AIBot from "../../../Components/ChatBotComponent/AIBot";
import { ThemeInterface } from "../../../Components/ThemeHandler/Themes";

function ChatBot() {
    const theme: ThemeInterface = useContext(colorContext);
  useEffect(()=>{
   document.title = 'Chat bot'
  },[])
    return (
        <>
            <Navbar />
            <div
                className="flex flex-row w-full h-screen   "
                style={{ overflow: "hidden", position: "fixed", top: "10", backgroundColor: `${theme.theme}` }}
            >
                <SideBar />
                <div className="w-[100%] md:w-[50%] flex justify-center">
                    <AIBot />
                </div>
                <RightSidebar />*
            </div>

            <Footer />
        </>
    );
}

export default ChatBot;
