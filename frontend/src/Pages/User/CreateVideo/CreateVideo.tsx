import React, { useEffect } from 'react'
import SideBar from "../../../Components/SideBar/SideBar";
import RightSidebar from "../../../Components/RightSidebar/RightSidebar";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";
import { useContext } from "react";
import { colorContext } from "../../../Context/colorContext";
import VideoUpload from '../../../Components/VideoUpload/VideoUpload';
import { ThemeInterface } from '../../../Components/ThemeHandler/Themes';


function CreateVideo() {
    const theme:ThemeInterface = useContext(colorContext)

    useEffect(()=>{
      document.title = 'Create Video'
    },[])
  return (
    <div>
       <Navbar />
               <div
                    className="flex flex-row w-full h-screen   "
                    style={{ overflow: "hidden", position: "fixed", top: "10", backgroundColor: `${theme?.theme}` }}
               >
                    <SideBar />
                    <div className="w-[100%] md:w-[50%]">
                       <VideoUpload/>
                    </div>
                    <RightSidebar />
               </div>

               <Footer />
    </div>
  )
}

export default CreateVideo
