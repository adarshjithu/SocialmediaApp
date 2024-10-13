import { useEffect } from "react";
import ASidebar from "../../../Components/Admin/ASidebar/ASidebar";

function AHome() {

     useEffect(()=>{
          document.title = 'Admin home page'
     },[])
     return (
          <>
               <ASidebar />
          </>
     );
}

export default AHome;
