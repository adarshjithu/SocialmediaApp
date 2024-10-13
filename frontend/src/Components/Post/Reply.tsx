import React, { useEffect } from "react";
import ReplyInput from "./ReplyInput";
import ReplyComment from "./ReplyComment";
import { useDispatch, useSelector } from "react-redux";
import { getReplies } from "../../Services/apiService/postServices";
import { setRepliesAction } from "../../features/post/postSlice";
import { RootState } from "../../app/store";

function Reply({ comment, index, handelReplyClick, replyIndex, setReplyIndex }: any) {
   const dispatch = useDispatch();
   const allReplies = useSelector((data: RootState) => data.post.replies);

   const handleReply = (index:string) => {
    
      const fetchData = async () => {
         const res = await getReplies(comment._id);
         dispatch(setRepliesAction(res?.data.result.replies));
      };
      
      fetchData();
      handelReplyClick(index);
   };

   return (
      <div>
         <div className="flex justify-between">
            <button className="text-blue-500 text-sm mt-2" onClick={() => handleReply(index)}>
               Reply
            </button>
         </div>
         {index == replyIndex && <ReplyInput comment={comment}/>}

         <div className="pl-4 mt-2">{index === replyIndex && allReplies.map((obj: any,index:number) => <ReplyComment index={index} key={obj._id} reply={obj} />)}</div>
      </div>
   );
}

export default Reply;
