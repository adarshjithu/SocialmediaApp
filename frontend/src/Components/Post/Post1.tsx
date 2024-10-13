import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageSlider from "../../Components/Post/ImageSlider";
import Video from "../../Components/Post/Video";
import Text from "../../Components/Post/Text";
import Comment from "../../Components/Post/Comment";
import { getDayDifference, noUserImage } from "../../Utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { likePostAction, unlikePostAction } from "../../features/post/postSlice";
import { reportPost, userLikePost, userUnlikePost } from "../../Services/apiService/postServices";
import Share from "./Share";
import { RootState } from "../../app/store";
import { useLocation } from "react-router-dom";
import { deletePost } from "../../Services/apiService/adminServices";
import { addAllPostForProfile } from "../../features/user/profileSlice";
import { Button } from "@mui/material";
import ReportModal from "./ReportModal";
import { SocketContext } from "../../Context/SocketProvider";

const PostComponent: React.FC<Partial<any>> = ({ post, setIsModalOpen, index }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const isCurrentUser = useSelector((data: RootState) => data.profile.isCurrentUser.status);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const socket = useContext(SocketContext);


    //Like post
    const likePost = async () => {
        const res = await userLikePost(post._id);

        dispatch(likePostAction({ postId: post._id, userId: res?.data.userId }));
        if (socket) socket.emit("notification",{type:'like',user:userData,receiverId:post.userData._id});
    };

    //Comment Post
    const unLikePost = async () => {
        const res = await userUnlikePost(post._id);
        dispatch(unlikePostAction({ postId: post._id, userId: res?.data.userId }));
        if (socket) socket.emit("notification",{type:'unlike',user:userData,receiverId:post.userData._id});
    };

    // State management
    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [replyIndex, setReplyIndex] = useState<number | null>(null);
    const allPost = useSelector((data: RootState) => data.profile.allPost);
    const [reportModal, setReportModal] = useState<boolean>(false);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const showConfirmDialog = () => {
        console.log("asdf");
        const confirmToast = () =>
            toast(
                ({ closeToast }) => (
                    <div className="bg-[#B029B5]  p-2 rounded-md">
                        <p className="text-white">Are you sure you want to proceed?</p>
                        <div className="flex flex-row justify-around mt-4 rounded-md">
                            <Button onClick={() => handleDelete(closeToast)} variant="contained" color="primary">
                                Confirm
                            </Button>
                            <Button onClick={closeToast} variant="contained" color="error">
                                Cancel
                            </Button>
                        </div>
                    </div>
                ),
                { autoClose: false } // Disable auto close to wait for user input
            );

        confirmToast();
    };

    const handleDelete = async (closeToast: any) => {
        const res = await deletePost(post._id);
        if (res?.data.success) {
            setShowOptions(false);
            setIsModalOpen(false);
            dispatch(addAllPostForProfile(allPost.filter((obj: any) => obj._id !== post._id)));
        }
        closeToast();
    };

    //
    const handleReplyClick = (index: number) => {
        setReplyIndex(replyIndex === index ? null : index);
    };

    const toggleShareOptions = () => {
        setShowShareOptions(!showShareOptions);
    };

    const handleShare = (friendName: string) => {
        alert(`Post shared with ${friendName}`);
    };

    return (
        <div className=" max-w-full mx-auto my-4 p-4 bg-white rounded-lg shadow-lg backdrop-blur-sm relative">
            {/* Post Header - User Info */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <img src={post?.userData.image ? post?.userData.image : noUserImage} alt="avatar" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <p className="font-bold">{post?.userData.name}</p>
                        <p className="text-gray-500 text-sm">{getDayDifference(post?.createdAt)}</p>
                    </div>
                </div>

                {/* Three Dots for Options */}
                <div className="relative">
                    <button className="text-gray-600 hover:text-gray-800" onClick={toggleOptions}>
                        <i className="fas fa-ellipsis-h"></i> {/* 3 dots */}
                    </button>

                    {/* Dropdown for Edit/Delete */}
                    {showOptions && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                            <ul className="py-1 text-gray-700">
                                {location.pathname == "/profile" ? (
                                    <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={showConfirmDialog}>
                                        Delete
                                    </li>
                                ) : (
                                    <>
                                        {reportModal ? (
                                            <ReportModal postId={post?._id} setReportModal={setReportModal} />
                                        ) : (
                                            <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setReportModal(true)}>
                                                Report
                                            </li>
                                        )}
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
            {/* checking image or video or text */}
            {/* Post Body - Image */}
            <div className="mb-4">
                {post?.contentType == "image" ? (
                    <ImageSlider post={post} />
                ) : post?.contentType == "text" ? (
                    <Text post={post} />
                ) : (
                    <Video post={post} />
                )}
            </div>

            {/* Post Footer - Like, Comment, Share */}
            <div className="flex justify-around text-gray-600 mb-4">
                {/* like part */}
                {/* Changing like and unlike button */}
                {!post?.isLiked ? (
                    <button className={`flex items-center space-x-1 hover:text-blue-500`}>
                        <i className="fas fa-thumbs-up"></i>
                        <span onClick={likePost}>Like ({post?.likes.length})</span>
                    </button>
                ) : (
                    <button className={`flex items-center space-x-1 text-blue-500`}>
                        <i className="fas fa-thumbs-up"></i>

                        <span onClick={unLikePost}>unLike ({post.likes.length})</span>
                    </button>
                )}

                {/* comment button */}
                <button onClick={toggleComments} className="flex items-center space-x-1 hover:text-blue-500">
                    <i className="fas fa-comment-alt"></i>
                    <span>Comment ({post.comments.length})</span>
                </button>
                {/* share button */}
                <button onClick={toggleShareOptions} className="flex items-center space-x-1 hover:text-blue-500">
                    <i className="fas fa-share"></i>
                    <span>Share</span>
                </button>
            </div>

            {/* Share Options - List of Friends */}
            {showShareOptions && <Share />}

            {/* Comments Displayed at the Bottom */}
            {showComments && <Comment post={post} />}
        </div>
    );
};

export default PostComponent;
