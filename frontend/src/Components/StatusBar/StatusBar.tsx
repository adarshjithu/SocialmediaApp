import React, { useContext, useEffect, useRef, useState } from "react";
import "./StatusBar.css";
import { colorContext } from "../../Context/colorContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllStatusData, isStatusUpload, viewStoryBar } from "../../features/post/status";
import { getAllStory } from "../../Services/apiService/postServices";
import LoadingComponent from "../Loading/LoadingComponent";

function StatusBar() {
     const theme: any = useContext(colorContext);
     const dispatch =useDispatch();
     const stories = useSelector((data:any)=>data.status.allStory);
     const [loading,setLoading] = useState<boolean>(false)
   
     
     

     const scrollRef: any = useRef(null);
     let isDown = false;
     let startX: any;
     let scrollLeft: any;

     //Get all status for the user

     useEffect(()=>{
       const fetchData = async()=>{
               setLoading(true)
               const res =  await getAllStory();
            
               dispatch(getAllStatusData(res?.data.result))
               setLoading(false)
       }
       fetchData()
     },[])

     const handleMouseDown = (e: any) => {
          isDown = true;
          scrollRef.current.classList.add("active");
          startX = e.pageX - scrollRef.current.offsetLeft;
          scrollLeft = scrollRef.current.scrollLeft;
     };

     const handleMouseLeave = () => {
          isDown = false;
          scrollRef.current.classList.remove("active");
     };

     const handleMouseUp = () => {
          isDown = false;
          scrollRef.current.classList.remove("active");
     };

     const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - scrollRef.current.offsetLeft;
          const walk = (x - startX) * 2; // Adjust scroll speed
          scrollRef.current.scrollLeft = scrollLeft - walk;
     };
     return (
          <div
               style={{ backgroundColor: `white`,boxShadow:"1px 1px 5px gray"}}
               className=" scroll-container p-2 rounded-xl w-full h-[18%]  flex flex-row  items-center sticky top-0 overflow-x-auto"
               onMouseDown={handleMouseDown}
               onMouseLeave={handleMouseLeave}
               onMouseUp={handleMouseUp}
               onMouseMove={handleMouseMove}
               ref={scrollRef}
          >
         
               <div className="mr-6" onClick={()=>{dispatch(isStatusUpload(true))}}>
                    <div className=" status-outer w-[60px] h-[60px] flex justify-center items-center rounded-[100%]">
                         <div className="w-[55px] h-[55px] rounded-[100%] bg-white relative">
                              <span className="text-[40px] h-[30px] rounded-[100%] absolute right-[-10px] bottom-[-2px] bg-[green] flex jusfify-center items-center text-[white] ">+</span>
                         </div>
                    </div>
                    <span style={{ color: `${theme.theme == "black" ? "white" : "black"}` }}>Adarsh</span>
               </div>

             

               {stories?.map((data:any,) => {
                    return (
                         <div key={data._id} className="mr-6" onClick={()=>dispatch(viewStoryBar({view:true,stories:data}))}>
                              <div className=" status-outer w-[60px] h-[60px] flex justify-center items-center rounded-[100%]">
                                   <div className="w-[55px] h-[55px] flex justify-center items-center rounded-[100%] bg-white">
                                        <img src={data.stories[0].image} alt="" className="rounded-[100%]"/>
                                   </div>
                              </div>
                              <span style={{ color: `${theme.theme == "black" ? "white" : "black"}` }}>{data.userId.name}</span>
                         </div>
                    );
               })}
          </div>
     );
}

export default StatusBar;
