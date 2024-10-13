import React, { useContext } from "react";
import { colorContext } from "../../Context/colorContext";

function Icon({auth}:any) {
     const theme:any =  useContext(colorContext)
     return (
          <div className="flex ml-4 justify-center items-center">
               <h1 className={`absolute top-[2px] left-[5px] md:absolute top-[5px] left-[5px] text-[20px] md:text-[30px] p-2 text-[#4B164C] font-bold `} style={{color:`${auth?theme.iconColor:'#fff'}`}}>Friendzy</h1>
          </div>
     );
}

export default Icon;
