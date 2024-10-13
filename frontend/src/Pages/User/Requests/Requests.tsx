import  { useContext, useEffect } from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import SideBar from "../../../Components/SideBar/SideBar";
import RightSidebar from "../../../Components/RightSidebar/RightSidebar";
import Footer from "../../../Components/Footer/Footer";
import { colorContext } from "../../../Context/colorContext";

import RequestComponent from "../../../Components/RequestComponent/RequestComponent";
import { ThemeInterface } from "../../../Components/ThemeHandler/Themes";

function Requests() {
   const theme: ThemeInterface = useContext(colorContext);
   useEffect(()=>{
      document.title = 'Requests'
    },[])
   return (
      <>
         <Navbar />
         <div
            className="flex flex-row w-full h-screen   "
            style={{ overflow: "hidden", position: "fixed", top: "10", backgroundColor: `${theme.theme}` }}
         >
            <SideBar />
            <RequestComponent/>
            <RightSidebar />*
         </div>

         <Footer />
      </>
   );
}

export default Requests;
