import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Avatar, IconButton, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { addNotification, blockPost, blockUser, deletePost, getAllLikesAndComments } from "../../../Services/apiService/adminServices";
import AllComments from "./AllComments";
import { noUserImage } from "../../../Utils/utils";

const PostManagement = (props: any) => {
    const [post, setPost] = useState<any>(props.edit);
    const [user, setUser] = useState(props.edit.userData);
    const [isPostBlocked, setIsPostBlocked] = useState<boolean>(props.edit.isBlocked);
    const [isUserBlocked, setIsUserBlocked] = useState(props.edit.userData.isBlocked);
    const [allLikes, setAllLikes] = useState([]);
    const [allComments, setAllComments] = useState();
    const [view, setView] = useState<boolean>(false);

    const deleteCurrentPost = async () => {
        console.log('dele')
        await deletePost(props.edit._id);
        props.setEdit("");
    };

    const banPost = async () => {
        await blockPost(post._id);
        
        setIsPostBlocked(!isPostBlocked);
    };

    const createNotification = async (arg: string) => {
     //    const notificationObj = {
     //        message: arg,
     //        userId: user?._id,
     //        postId: post._id,
     //        data: arg == "ban-post" ? post?.reported : "",
     //    };

     //    const res = await addNotification(notificationObj);
    };

    const banUser = async () => {
        await blockUser(props.edit.userData);
   
        setIsUserBlocked(!isUserBlocked);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllLikesAndComments(props.edit._id);
            setAllLikes(res?.data.result.likes.likes);
            setAllComments(res?.data.result.comments);
        };
        fetchData();
    }, []);
    return (
        <Card>
            <CardContent>
                <div className="flex flex-row w-full justify-around ">
                    <div className="flex flex-row w-[50%] flex-start">
                        <i onClick={() => props.setEdit(null)} className="fa-solid fa-arrow-left fa-lg mr-2 mt-4"></i>

                        <Typography variant="h5" gutterBottom>
                            Post details
                        </Typography>
                    </div>
                    <div className="w-[50%] flex justify-center">
                        <Typography variant="h5" gutterBottom>
                            User details
                        </Typography>
                    </div>
                </div>

                <Grid container spacing={2}>
                    {/* Post Details */}
                    <Grid item xs={12} md={6}>
                        <img src={post?.images[0]} alt="Post" style={{ width: "100%", height: "auto" }} />
                        <Typography variant="body1" gutterBottom>
                            {post?.description}
                        </Typography>

                        <div className="flex flex-row w-full justify-between">
                            <div className="p-2">
                                <h1 className="text-[20px]">Comments: {post?.comments.length}</h1>
                                <Button
                                    onClick={() => {
                                        setView(!view);
                                    }}
                                    variant="contained"
                                    color="primary"
                                >
                                    Manage Comments
                                </Button>
                            </div>
                        </div>

                        <div className="all w-full">{view && <AllComments allComments={allComments} />}</div>
                    </Grid>

                    {/* User Details */}
                    <div className="p-5">
                        <img className="w-[75px] h-[75px] rounded-full" src={user?.image ? user?.image : noUserImage} alt="" />
                        <h1 className="text-[20px] mt-4">{user.name}</h1>
                        <h1 className="mt-4">{user.email}</h1>
                        <h1 className="mt-4">{user.phonenumber}</h1>
                        <div className="flex flex-row mt-4">
                            <span className="text-[gray] text-[14px] mr-4">Status: </span>{" "}
                            <h2 style={{ color: `${user.isBlocked ? "red" : "#00ff00"}` }}>{user.isBlocked ? "Blocked" : "Active"}</h2>
                        </div>
                        <div className="flex flex-row mt-4">
                            <span className="text-[gray] text-[14px] mr-4">SignupAt: </span> <h2>{new Date(user.createdAt).toDateString()}</h2>
                        </div>
                        <div className="w-full">
                            <Button
                                onClick={()=>{deleteCurrentPost();createNotification('delete-post')}}
                                sx={{ marginTop: "20px", marginRight: "0px" }}
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                            >
                                Delete Post
                            </Button>

                            {isUserBlocked ? (
                                <Button
                                    onClick={()=>{banUser();createNotification('ban-user')}}
                                    sx={{ marginTop: "20px", marginLeft: "20px" }}
                                    variant="contained"
                                    color="error"
                                    startIcon={<BlockIcon />}
                                >
                                    Ban User
                                </Button>
                            ) : (
                                <Button
                                    onClick={banUser}
                                    sx={{ marginTop: "20px", marginLeft: "20px" }}
                                    variant="contained"
                                    color="success"
                                    startIcon={<BlockIcon />}
                                >
                                    Unban User
                                </Button>
                            )}

                            {!isPostBlocked ? (
                                <Button
                                    onClick={()=>{banPost();createNotification('ban-post')}}
                                    sx={{ marginTop: "20px", marginLeft: "10px" }}
                                    variant="contained"
                                    color="error"
                                    startIcon={<BlockIcon />}
                                >
                                    Ban Post
                                </Button>
                            ) : (
                                <Button
                                    onClick={banPost}
                                    sx={{ marginTop: "20px", marginLeft: "10px" }}
                                    variant="contained"
                                    color="success"
                                    startIcon={<BlockIcon />}
                                >
                                    UnBan
                                </Button>
                            )}
                        </div>
                    </div>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PostManagement;
