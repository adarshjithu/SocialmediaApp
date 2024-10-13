import React, { useState } from "react";

function LastReply({ comment, index }: any) {
    const like = (type: string) => {};
    const [isLiked, setIsLiked] = useState<boolean>(comment?.isLiked);
    const [likeCount, setLikeCount] = useState(comment?.likes.length);

    const handleReplies = (index: number) => {};
    return (
        <div className="border-b py-1 ml-12">
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
            {/* <button className="text-blue-500 text-sm mt-2" onClick={() => handleReplies(index)}>
                Reply
            </button> */}
            {/* {index == inputModalIndex && <ReplyInput3 comment={comment} />} */}
            {/* {index==inputModalIndex&&data.map((obj:any,index:number)=>{
                return <LastReply data={obj}/>
            })} */}
        </div>
    );
}

export default LastReply;
