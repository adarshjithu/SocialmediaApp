import React, { useState } from "react";
import { ReplyCommentInterface } from "../../interfaces/Interface";
import { getReplies, likeReplyComment } from "../../Services/apiService/postServices";
import ReplyInput2 from "./ReplyInput2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setRepliesOfRepliesAction } from "../../features/post/postSlice";
import ReplyComment2 from "./ReplyComment2";

function ReplyComment({ reply, replyIndex, index }: ReplyCommentInterface) {
    const [isLiked, setIsLiked] = useState(reply?.isLiked);
    const [likeCount, setLikeCount] = useState(reply?.likes.length);
    const [inputModalIndex, setInputModalIndex] = useState<number | null>();
    const dispatch = useDispatch();
    const repliesOfReplies = useSelector((data: RootState) => data.post.repliesOfReplies);

    const like = async (type: string) => {
        const res = await likeReplyComment(reply?._id, type);
        setIsLiked(!isLiked);
        if (type == "push") setLikeCount(likeCount + 1);
        else {
            setLikeCount(likeCount - 1);
        }
    };

    const handleReplies = async (index: number) => {
        setInputModalIndex(inputModalIndex == null ? index : null);
        const res = await getReplies(reply?._id);
        dispatch(setRepliesOfRepliesAction(res?.data.result.replies));
    };

    return (
        <div key={replyIndex} className="border-b py-1 ml-6">
            <div className="flex justify-between items-center mb-1">
                <div>
                    <p className="font-bold">{reply?.userId.name}</p>
                    <p>{reply?.content}</p>
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
            <button className="text-blue-500 text-sm mt-2" onClick={() => handleReplies(index)}>
                Reply
            </button>
            {index == inputModalIndex && <ReplyInput2 comment={reply} />}
            {index == inputModalIndex &&
                repliesOfReplies?.map((comment: any, index: number) => {
                    return <ReplyComment2 comment={comment} index={index} />;
                })}
        </div>
    );
}

export default ReplyComment;
