import React, { useState } from "react";
import { getReplies, likeReplyComment } from "../../Services/apiService/postServices";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setRepliesOfRepliesOfRepliesAction } from "../../features/post/postSlice";
import LastReply from "./LastReply";
import ReplyInput3 from "./ReplyInput3";




function ReplyComment2({ comment,index}: any) {
    const [isLiked, setIsLiked] = useState(comment?.isLiked);
    const [likeCount, setLikeCount] = useState(comment?.likes.length);
    const [inputModalIndex, setInputModalIndex] = useState<number | null>();
    const dispatch = useDispatch();
     const data =  useSelector((data:RootState)=>data.post.repliesOfRepliesOfReplies);
   

    const like = async (type: string) => {
        const res = await likeReplyComment(comment?._id, type);
        setIsLiked(!isLiked);
        if (type == "push") setLikeCount(likeCount + 1);
        else {
            setLikeCount(likeCount - 1); 
        }
    };

    const handleReplies = async(index: number) => {
        setInputModalIndex(inputModalIndex == null ? index : null);
         const res = await getReplies(comment?._id);
         
        dispatch(setRepliesOfRepliesOfRepliesAction(res?.data.result.replies))
    };

    return (
        <div key={index} className="border-b py-1 ml-12">
            <div className="flex justify-between items-center mb-1">
                <div>
                    <p className="font-bold">{comment?.userId.name}</p>
                    <p>{comment?.content}</p>
                </div>
                <button className="flex items-center text-gray-600 hover:text-blue-500">
                    {isLiked ? (
                        <i onClick={() => like("pull")} className="fas fa-thumbs-down"></i>
                    ) : (
                        <i onClick={() => like("push")} className="fas fa-thumbs-up"></i>
                    )}
                     <span className="ml-1">{likeCount}</span> 
                </button>
            </div>
            <button className="text-blue-500 text-sm mt-2"
             onClick={() => handleReplies(index)}
             >
                Reply
            </button>
            {index == inputModalIndex && <ReplyInput3 comment={comment} />}
            {index==inputModalIndex&&data.map((obj:any,index:number)=>{
                return <LastReply key={index} index={index} comment={obj}/>
            })}
        </div>
    );
}

export default ReplyComment2;
