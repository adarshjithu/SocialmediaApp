import React, { useEffect, useState } from "react";
import { replyComment, userLikeComment, userUnlikeComment } from "../../Services/apiService/postServices";
import { Button } from "@mui/material";
import Picker, { EmojiClickData } from "emoji-picker-react";
import toast from "react-hot-toast";
function CommentData({ data, reload, setReload }: any) {
     const [comment, setComment] = useState<string>("");
     const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
     const [replyId, setReplyId] = useState<string | null>(null);

     //for getting the time difference of comments
     function getDayDifference(commentDate: any) {
          const commentDateObj: any = new Date(commentDate);
          const currentDate: any = new Date();
          const timeDiff = currentDate - commentDateObj;

          const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          if (dayDiff === 0) {
               const hourDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // Calculate hour difference
               if (hourDiff === 0) {
                    const minuteDiff = Math.floor(timeDiff / (1000 * 60)); // Less than an hour, show minutes
                    return `${minuteDiff} minutes `;
               }
               return `${hourDiff} hours `;
          }
          return `${dayDiff} days `;
     }

     const toggleEmojiPicker = () => {
          setShowEmojiPicker(!showEmojiPicker);
     };

     //like comment
     const likeComment = async () => {
          await userLikeComment(data._id);
          setReload(!reload);
     };
     //unlike comment
     const unlikeComment = async () => {
          await userUnlikeComment(data._id);
          setReload(!reload);
     };

     //add imoji
     const addEmoji = (emojiData: EmojiClickData) => {
          setComment((prevComment) => prevComment + emojiData.emoji);
     };

     useEffect(() => {}, [reload]);

     //submit
     const handleSubmit = async () => {
          if (!comment) toast.error("Write something");
          else {
               setShowEmojiPicker(false);
               setReplyId(null);
               await replyComment(comment, data._id);
               setReload(!reload);
          }
     };
     return (
          <div className="">
              
               <div className="parent w-[100%] p-4 flex flex-row ">
                    {/* //image */}
                    <div className="w-[10%] p-2">
                         <img
                              className="w-[40px] h-[40px] bg-gray"
                              src={
                                   data.userData.image
                                        ? data.userData.image
                                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7FFnwgGnpnI9RDP35VyvHXM_ZKFHSfztBGw&s"
                              }
                              alt=""
                              style={{ borderRadius: "100%" }}
                         />
                    </div>

                    {/* //comment body part */}
                    <div className="w-[80%] flex flex-col  rounded-lg p-2">
                         <div className="bg-[#F2F2F2] w-full rounded-xl p-2 border">
                              <div className="top flex flex-row">
                                   <h2 className="font-medium">{data.userData.name}</h2>
                                   <span className="ml-5 text-[13px]">
                                        <span className="mx-2">•</span>
                                        {getDayDifference(data.createdAt)}
                                   </span>
                              </div>

                              {/* //imoji picker for reply */}
                              {showEmojiPicker && <Picker onEmojiClick={addEmoji} style={{ position: "absolute", zIndex: 1000, left: "100px" }} />}

                              <div className="bottom">
                                   <h2 className="break-words">{data.content}</h2>
                              </div>

                              <div>
                                   <span
                                        onClick={() => {
                                             if (replyId) {
                                                  setReplyId(null);
                                             } else setReplyId(data._id);
                                        }}
                                        className="text-[13px] cursor-pointer"
                                   >
                                        Reply
                                   </span>
                              </div>
                         </div>

                         {/* //Add reply */}

                         {replyId == data._id ? (
                              <div className="flex flex-row w-[100%] mt-2 h-[] justify-between rounded-md ">
                                   <div className="w-[70%] h-[100%] flex flex-row items-center ml-2 rounded-xl" style={{ border: "1px solid gray" }}>
                                        <textarea
                                             value={comment}
                                             onChange={(e) => setComment(e.target.value)}
                                             placeholder="Type a comment..."
                                             rows={1}
                                             className="w-[90%] h-[100%] rounded-xl p-2  "
                                        />
                                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-[10%]">
                                             <span className="text-xl"> 😊</span>
                                        </button>
                                   </div>
                                   <div className="w-[20%] flex items-center justify-center ">
                                        <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#4B164C", width: "80%" }}>
                                             Reply
                                        </Button>
                                   </div>
                              </div>
                         ) : (
                              ""
                         )}
                    </div>

                    {/* //comment like session */}
                    <div className="w-[10%] flex flex-row justify-end">
                         {data.isLiked ? (
                              <>
                                   <i onClick={unlikeComment} className="fa-solid fa-heart cursor-pointer" style={{ color: "red" }}></i>
                                   <span className="text-[13px] ml-2">{data?.likes.length}</span>
                              </>
                         ) : (
                              <i onClick={likeComment} className="fa-regular fa-heart cursor-pointer"></i>
                         )}
                    </div>
               </div>

               {/* //replies */}
               {data.replies.map((e: any) => {
                    return (
                         <div className="w-[100%] flex flex-row p-2">
                              <div className="w-[10%]"></div>
                              <div className="w-[80%]  flex flex-row">
                                   <div className="w-[15%]">
                                        <img
                                             className="w-[40px] h-[40px] bg-gray"
                                             src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7FFnwgGnpnI9RDP35VyvHXM_ZKFHSfztBGw&s"}
                                             alt=""
                                             style={{ borderRadius: "100%" }}
                                        />
                                   </div>
                                   <div className="w-[85%] bg-[#F2F2F2] p-2 rounded-xl">
                                        <div className="flex flex-row">
                                             <h1>Adarsh</h1>
                                             <span className="text-[13px] ml-5">•{getDayDifference(e.createdAt)}</span>
                                        </div>
                                        <h2>{e.content}</h2>
                                   </div>
                              </div>
                              <div className="w-[10%] flex justify-end p-2">
                                   <i onClick={likeComment} className="fa-regular fa-heart cursor-pointer"></i>
                              </div>
                         </div>
                    );
               })}
          </div>
     );
}

export default CommentData;
