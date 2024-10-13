import { useState } from "react";
import "./Confirm.css";
import { Button } from "@mui/material";

function Confirm({handleConfirm,confirm,setConfirm}:any) {

    const [visible,setVisible] = useState<boolean>(true)

     return (
          <div
               className=" confirm absolute bg-[#b029b5] w-[300px h-[180px] rounded-md p-8 flex flex-col justify-between"
               style={{ boxShadow: "1px 1px 5px black", zIndex: "1",display:`${visible?'':'none'}` }}
          >
               <div className="message">
                    <h1 className="text-white text-center">Are you Sure Want To Delete this task?</h1>
               </div>
               <div className="buttons w-full flex flex-row justify-between">
                    <Button onClick={()=>{handleConfirm(true);setVisible(false),setConfirm(!confirm)}} variant="contained">Confirm</Button>
                    <Button onClick={()=>{handleConfirm(false);setVisible(false),setConfirm(!confirm)}} variant="contained" style={{ backgroundColor: "red" }}>
                         Cancel
                    </Button>
               </div>
          </div>
     );
}

export default Confirm;
