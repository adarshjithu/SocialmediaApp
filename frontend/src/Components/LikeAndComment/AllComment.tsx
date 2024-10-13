import React, { useEffect, useState } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { useSelector, useDispatch } from "react-redux";
import { isUnComment } from "../../features/user/commentSlice";
import { Button } from "@mui/material";
import { getAllComments, userCommentPost } from "../../Services/apiService/postServices";
import CommentData from "./CommentData";
import toast from "react-hot-toast";
const AllComment: React.FC = (props: any) => {
     const comments: any = useSelector((data: any) => data.comment);
     const dispatch = useDispatch();
     const [comment, setComment] = useState<string>("");
     const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
     const [allComments, setAllComments] = useState<Record<string, any>[]>();
     const [update, setUpdate] = useState<boolean>(false);
     const [loading, setLoading] = useState<boolean>(false);

     //Add imoji functionality
     const addEmoji = (emojiData: EmojiClickData) => {
          setComment((prevComment) => prevComment + emojiData.emoji);
     };

     //Toggle the emoji picker
     const toggleEmojiPicker = () => {
          setShowEmojiPicker((prevState) => !prevState);
     };

     //Submit the comment
     const handleSubmit = async () => {
          if (!comment) toast.error("Write somenthing");
          else {
               setShowEmojiPicker((prevState) => false);
               if (comment.trim()) {
                    const res = await userCommentPost(comments.postId, comment);
                    setUpdate(!update);
                    setLoading(!loading)
               }
          }
     };
     //For getting all the comment for a specific post
     useEffect(() => {
          const fetchData = async () => {
               setLoading(true);
               const res = await getAllComments(comments.postId);

               setAllComments(res?.data.comments);
               setLoading(false);
          };
          fetchData();
     }, [update]);
     return (
          <div
               className="fixed h-[90%] w-[100%] md:w-[630px] bg-white  "
               style={{ zIndex: "1", border: "1px solid gray", boxShadow: "1px 1px 5px black" }}
          >
               <div className="h-[10%] w-[100%] flex flex-row justify-center items-center" style={{ borderBottom: "1px solid #d6d9dc" }}>
                    <div className="w-[90%] flex justify-center">
                         <h2>Comments</h2>
                    </div>
                    <div className="w-[10%]">
                         <i onClick={() => dispatch(isUnComment())} className="fa-solid fa-xl fa-xmark"></i>
                    </div>
               </div>

               {/* Imoji picker */}
               {showEmojiPicker && <Picker onEmojiClick={addEmoji} style={{ position: "absolute", zIndex: 1000 }} />}

               {/* //Loading */}

               <div
                    className="w-[100%] h-[78%] overflow-y-scroll"
                    style={{
                         display: `${allComments?.length == 0 ? "flex" : ""}`,
                         justifyContent: `${allComments?.length == 0 ? "center" : ""}`,
                         alignItems: `${allComments?.length == 0 ? "center" : ""}`,
                    }}
               >
                    {allComments?.length == 0 ? <h1>No Comments</h1> : ""}

                    {allComments?.map((obj, index) => {
                         return <CommentData data={obj} key={obj._id} reload={update} setReload={setUpdate} />;
                    })}
               </div>

               <div className="flex flex-row w-[100%] h-[10%] rounded-md ">
                    <div className="w-[70%] h-[100%] flex flex-row items-center ml-2 rounded-xl" style={{ border: "1px solid gray" }}>
                         <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Type a comment..."
                              rows={1}
                              className="w-[90%] h-[100%] rounded-xl p-2  "
                         />
                         <button onClick={toggleEmojiPicker} className="w-[10%]">
                              <span className="text-2xl"> 😊</span>
                         </button>
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                         <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#4B164C" }}>
                              Post
                         </Button>
                    </div>
               </div>
          </div>
     );
};
export default AllComment;
