import Picker, { EmojiClickData } from "emoji-picker-react";
import React, { useContext, useState, useEffect } from "react";
import { colorContext } from "../../Context/colorContext";
import ReplyComment from "./ReplyComment";
import Reply from "./Reply";
import { IPost } from "../../interfaces/Interface";
import { getAllComments, getReplies, userCommentPost, userLikeComment, userUnlikeComment } from "../../Services/apiService/postServices";
import { useDispatch, useSelector } from "react-redux";
import { addCommentsAction, setRepliesAction } from "../../features/post/postSlice";
import { RootState } from "../../app/store";
import LoadingComponent from "../Loading/LoadingComponent";
import ReplyInput from "./ReplyInput";
import toast from "react-hot-toast";
import { ThemeInterface } from "../ThemeHandler/Themes";
import { SocketContext } from "../../Context/SocketProvider";

function Comment({ post }: IPost) {
   const [showComments, setShowComments] = useState(false);
   const [showOptions, setShowOptions] = useState(false);
   const [replyIndex, setReplyIndex] = useState<number | null>(null);
   const [newComment, setNewComment] = useState("");
   const theme: ThemeInterface = useContext(colorContext);
   const dispatch = useDispatch();
   const allComments = useSelector((data: RootState) => data.post.comments);
   const allReplies = useSelector((data: RootState) => data.post.replies);
   const socket = useContext(SocketContext)
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [reload, setReload] = useState<boolean>(false);
   const [buttonLoading, setButtonLoading] = useState<boolean>(false);
   const userData = JSON.parse(localStorage.getItem("userData") || "{}");
   // Function to add emoji to new comment
   const addEmoji = (emojiData: EmojiClickData) => {
      setNewComment((prev) => prev + emojiData.emoji);
   };

   // Handle new comment submission
   const handleAddComment = async () => {
      if(newComment==''){
         toast.error('Write Something!')
      }else{
         if(socket){socket.emit('notification',{type:'comment',user:userData,receiverId:post.userData._id})}
         setButtonLoading(true);
         const res = await userCommentPost(post._id, newComment);
         if (res?.data.result) {
            setReload(!reload);
            setButtonLoading(false);
         } else {
            setButtonLoading(false);
         }
      }
   };

   // Like comment
   const likeComment = async (id: string) => {
      if(socket){socket.emit('notification',{type:'like-comment',user:userData,receiverId:post.userData._id})}
      await userLikeComment(id);
      setReload(!reload);
   };

   // Unlike comment
   const unlikeComment = async (id: string) => {
      if(socket){socket.emit('notification',{type:'unlike-comment',user:userData,receiverId:post.userData._id})}
      await userUnlikeComment(id);
      setReload(!reload);
   };

   const toggleComments = () => {
      setShowComments(!showComments);
   };

   const toggleOptions = () => {
      setShowOptions(!showOptions);
   };

   // For getting first level replies
   const handleReplyClick = async (index: number) => {
      
      setReplyIndex((prev) => (replyIndex === index ? null : index));
      // const res = await getReplies(commentId);
      // dispatch(setRepliesAction(res?.data.result.replies));
   };

   useEffect(() => {
      const fetchData = async () => {
         const res = await getAllComments(post._id);
         dispatch(addCommentsAction(res?.data.comments));
      };
      fetchData();
   }, [reload]);

   return (
      <>
         {/* Add Comment Input */}
         <div className="bg-white p-2 rounded-lg shadow-sm mb-4 flex items-center space-x-2 relative">
            <input
               type="text"
               value={newComment}
               onChange={(e) => setNewComment(e.target.value)}
               placeholder="Write a comment..."
               className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="bg-gray-100 text-gray-600 px-2 py-2 rounded-lg hover:bg-gray-200">
               😀
            </button>
            {showEmojiPicker && (
               <div className="absolute bottom-12">
                  <Picker onEmojiClick={addEmoji} style={{ position: "absolute", zIndex: 1000 }} />
               </div>
            )}
            <button
               onClick={handleAddComment}
               className="text-white px-4 py-2 rounded-lg transition-colors"
               style={{ backgroundColor: `${theme?.normalButton.backgroundColor}` }}
            >
               {buttonLoading ? <LoadingComponent /> : "Post"}
            </button>
         </div>

         {/* Comments Section */}
         <div className="bg-gray-100 p-2 rounded-lg mt-4">
            {allComments?.length > 0 ? (
               allComments.map((comment: Record<string, any>, index: number) => (
                  <div key={index} className="border-b py-2">
                     <div className="flex justify-between items-center mb-2">
                        <div>
                           <p className="font-bold">{comment?.userData.name}</p>
                           <p>{comment.content}</p>
                        </div>

                        <button className="flex items-center text-gray-600 hover:text-blue-500">
                           {comment?.isLiked ? (
                              <i className="fas fa-thumbs-down" onClick={() => unlikeComment(comment._id)}></i>
                           ) : (
                              <i className="fas fa-thumbs-up" onClick={() => likeComment(comment._id)}></i>
                           )}

                           <span className="ml-1">{comment.likes.length}</span>
                        </button>
                     </div>
                     <Reply comment={comment} index={index} handelReplyClick={handleReplyClick} replyIndex={replyIndex} setReplyIndex={setReplyIndex}/>
                  </div>
               ))
            ) : (
               <p className="text-gray-500">No comments yet.</p>
            )}
            <div className="flex justify-between mt-4">
               <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Previous</button>
               <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Next</button>
            </div>
         </div>
      </>
   );
}

export default Comment;
