import React, { useContext, useState } from "react";
import { colorContext } from "../../Context/colorContext";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { replyRepliedComment } from "../../Services/apiService/postServices";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setRepliesOfRepliesAction, setRepliesOfRepliesOfRepliesAction } from "../../features/post/postSlice";
import LoadingComponent from "../Loading/LoadingComponent";

function ReplyInput3({ comment }: any) {
    const [newComment, setNewComment] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const theme: any = useContext(colorContext);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    // Submit comment
    const handleAddComment = async () => {
        if (newComment === "") {
            toast.error("Write something !");
        } else {
         setLoading(true)
            const res = await replyRepliedComment(newComment, comment?._id);
          
            setLoading(false)
            dispatch(setRepliesOfRepliesOfRepliesAction(res?.data.result.replies));
            setNewComment("");
        }
    };

    //Function for emoji selection
    const addEmoji = (emojiData: EmojiClickData) => {
        setNewComment((prev) => prev + emojiData.emoji);
    };

    return (
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
                {loading?<LoadingComponent/>:"Reply"}
            </button>
        </div>
    );
}

export default ReplyInput3;
