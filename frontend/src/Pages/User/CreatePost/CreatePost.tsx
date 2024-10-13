import SideBar from "../../../Components/SideBar/SideBar";
import RightSidebar from "../../../Components/RightSidebar/RightSidebar";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";
import { useContext, useEffect } from "react";
import { colorContext } from "../../../Context/colorContext";
import UploadImage from "../../../Components/UploadImage/UploadImage";
import { ThemeInterface } from "../../../Components/ThemeHandler/Themes";

function CreatePost() {
     const theme: ThemeInterface = useContext(colorContext);
     useEffect(()=>{
       document.title = 'Create post'
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
                         <UploadImage />
                    </div>
                    <RightSidebar />
               </div>

               <Footer />
          </div>
     );
}

export default CreatePost;
