import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";
import Main from "../../../Components/Main/Main";
import RightSidebar from "../../../Components/RightSidebar/RightSidebar";
import { colorContext } from "../../../Context/colorContext";
import SideBar from "../../../Components/SideBar/SideBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BirthdayNotification from "../../../Components/Notification/Notifications";


function Home() {
     const [create, setCreate] = useState<boolean>(false);
     const theme: any = useContext(colorContext);
     const user = useSelector<any>((data) => data?.auth?.userData);
     const navigate = useNavigate();
     

     useEffect(() => { 
           document.title = 'Home Page'
          if (!user) {
               navigate("/login");
          }
     }, []);
     return (
          <>
          <BirthdayNotification/>
      
             
               <Navbar />
               <div
                    className="flex flex-row w-full h-screen   "
                    style={{ overflow: "hidden", position: "fixed", top: "10", backgroundColor: `${theme.theme}` }}
               >
                    <SideBar />
                    <Main />
                    <RightSidebar />*
               </div>

               <Footer />
          </>
     );
}

export default Home;
