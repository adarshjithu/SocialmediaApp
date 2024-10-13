import React, { useContext, useEffect } from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import SideBar from "../../../Components/SideBar/SideBar";
import RightSidebar from "../../../Components/RightSidebar/RightSidebar";
import Footer from "../../../Components/Footer/Footer";
import { colorContext } from "../../../Context/colorContext";
import SearchFriends from "../../../Components/SearchFriends/SearchFriends";
import RequestComponent from "../../../Components/RequestComponent/RequestComponent";
import ChatApp from "../../../Components/Chat/ChatComponent";
import { ThemeInterface } from "../../../Components/ThemeHandler/Themes";

function Messages() {
   const theme: ThemeInterface = useContext(colorContext);

   useEffect(()=>{
      document.title = 'Messages'
    },[])
   return (
      <>
         <Navbar />
         <div
            className="flex flex-row w-full h-screen   "
            style={{ overflow: "hidden", position: "fixed", top: "10", backgroundColor: `${theme.theme}` }}
         >
            <SideBar />
            <ChatApp/>
         </div>

         <Footer />
      </>
   );
}

export default Messages;
