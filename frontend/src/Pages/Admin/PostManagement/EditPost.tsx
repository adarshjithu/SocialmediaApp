import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Avatar, IconButton, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { blockPost, blockUser, deletePost, getAllLikesAndComments } from "../../../Services/apiService/adminServices";
import AllComments from "./AllComments";

const PostManagement = (props: any) => {
     const [post, setPost] = useState<any>(props.edit);
     const [user, setUser] = useState(props.edit.userData);
     const [isPostBlocked, setIsPostBlocked] = useState<boolean>(props.edit.isBlocked);
     const [isUserBlocked, setIsUserBlocked] = useState(props.edit.userData.isBlocked);
     const [allLikes, setAllLikes] = useState([]);
     const [allComments, setAllComments] = useState();
     const [view, setView] = useState<boolean>(false)

     const deleteCurrentPost = async () => {
          await deletePost(props.edit._id);
          props.setEdit("");
     };

     const banPost = async () => {
          await blockPost(post._id);
          setIsPostBlocked(!isPostBlocked);
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
               console.log(res?.data.result.comments);
          };
          fetchData();
     }, []);
     return (
          <Card>
               <CardContent>
                    <Typography variant="h5" gutterBottom>
                         Post Management
                    </Typography>

                    <Grid container spacing={2}>
                         {/* Post Details */}
                         <Grid item xs={12} md={6}>
                              <Typography variant="h6">Post Details</Typography>
                              <img src={post?.images[0]} alt="Post" style={{ width: "100%", height: "auto" }} />
                              <Typography variant="body1" gutterBottom>
                                   {post?.description}
                              </Typography>

                              <div className="flex flex-row w-full justify-between">
                                   <div className="p-2">
                                        <h1 className="text-[20px]">Comments: {post?.comments.length}</h1>
                                        <Button
                                             onClick={() => {
                                                 setView(!view)
                                             }}
                                             variant="contained"
                                             color="primary"
                                        >
                                             Manage Comments
                                        </Button>
                                   </div>
                                   <div className="p-2">
                                        <h1 className="text-[20px]">Likes: {post?.likes.length}</h1>
                                        <Button variant="contained" color="primary">
                                             Manage Likes
                                        </Button>
                                   </div>
                              </div>

                              <div className="all w-full">{view  && <AllComments allComments={allComments} />}</div>
                         </Grid>

                         {/* User Details */}
                         <div className="p-5">
                              <h1 className="text-[20px]">User Details</h1>

                              <img
                                   className="w-[75px] h-[75px]"
                                   src="data:image/jpeg;base64,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"
                                   alt=""
                              />
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
                                        onClick={deleteCurrentPost}
                                        sx={{ marginTop: "20px", marginRight: "0px" }}
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                   >
                                        Delete Post
                                   </Button>

                                   {isUserBlocked ? (
                                        <Button
                                             onClick={banUser}
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
                                             onClick={banPost}
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
