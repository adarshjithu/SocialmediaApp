import React from "react";
import { useDispatch } from "react-redux";
import { isComment } from "../../features/user/commentSlice";
import { useSelector } from "react-redux";
function Comment({ postData }: any) {
     const dispatch = useDispatch();
     const comment:any =  useSelector((data:any)=>data?.comment)
     const commentPost = () => {
       
          dispatch(isComment(postData._id));
     };
     return (
          <div className="ml-5 flex flex-col items-center mt-2" onClick={commentPost}>
               <i className="fa-regular fa-comment fa-xl"></i>
               <p className="mt-2" style={{ fontSize: "14px" }}>
                    Comment
               </p>
          </div>
     );
}

export default Comment;
