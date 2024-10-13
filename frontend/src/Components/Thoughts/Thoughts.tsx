import React, { useContext, useRef, useState } from "react";
import "./Thoughts.css";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { Button, TextField } from "@mui/material";
import { colorContext } from "../../Context/colorContext";
import { useNavigate } from "react-router-dom";
import { feelingPost } from "../../Services/apiService/postServices";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { noUserImage } from "../../Utils/utils";

function Thoughts(props:any) {
     const theme: any = useContext(colorContext);
     const [comment, setComment] = useState<string>("");
     const navigate = useNavigate();
     const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
     const user = useSelector((data:RootState)=>data.auth.userData)
     const addEmoji = (emojiData: EmojiClickData) => {
          setComment((prevComment) => prevComment + emojiData.emoji);
     };
       
     const feelingRef:any = useRef(null)

     const feeling = ()=>{
          if(feelingRef.current!==null){

               feelingRef.current.focus()
          }
     }
     const handleSubmit = async()=>{
          if(!comment) toast.error("Empty Post")
               else{
          const result =  await feelingPost(comment) ;
          setShowEmojiPicker(false)
          props.setReload(!props.reload)
          }
     }
     return (
          <>
               <div className="thoughts sticky-0   ">
                    <div></div>
                    <div className="w-[10%] mt-2">
                         <img src={`${user?user.image:noUserImage}`} className="h-[40px] w-[40px] rounded-[100%]" />
                    </div>
                    <div className="w-[60%] mt-2 bg-[#D9D9D9] rounded-[20px]">
                         <input
                              ref={feelingRef}
                              className=" inp w-[85%] h-[40px] bg-[#D9D9D9] rounded-[20px]  p-4"
                              placeholder="Whats On Your Mind ?"
                              color="#4B164C"
                              type="text"
                              name=""
                              id=""
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                         />
                         <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-[10%]">
                              <span className="text-xl"> 😊</span>
                         </button>
                    </div>

                    <div className="w-[10%] h-full flex justify-center items-center mt-2">
                         <Button onClick={handleSubmit} variant="contained" size="small" sx={{ backgroundColor: "#4B164C" }}>
                              Post
                         </Button>
                    </div>
               </div>

               <div className="thoughts">
                    <hr style={{ color: "black", width: "95%" }} />
               </div>
               <div className="w-full flex flex-row justify-around mt-4 thoughts-post">
                    <div style={{ color: `${theme.thoughts.fontColor}` }} onClick={() => navigate("/create")}>
                         <i className="fa-solid fa-image fa-lg p-5" style={{ color: `${theme.thoughts.iconColor}` }}></i>
                         Photo
                    </div>
                    <div style={{ color: `${theme.thoughts.fontColor}`, cursor: "pointer" }} onClick={() => navigate("/create-video")}>
                         <i className="fa-solid fa-video fa-lg p-5" style={{ color: `${theme.thoughts.iconColor}` }}></i>
                         Video
                    </div>
                    <div onClick={feeling} style={{ color: `${theme.thoughts.fontColor}` }}>
                         <i className="fa-solid fa-smile fa-lg p-5" style={{ color: `${theme.thoughts.iconColor}` }}></i>
                         Feeling
                    </div>
               </div>
               {showEmojiPicker && <Picker onEmojiClick={addEmoji} style={{ position: "absolute", zIndex: 1000, left: "100px" }} />}
          </>
     );
}

export default Thoughts;
