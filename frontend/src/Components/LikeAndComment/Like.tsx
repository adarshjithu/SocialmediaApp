import React from "react";
import { userLikePost, userUnlikePost } from "../../Services/apiService/postServices";

function Like({ postData, posts, setPosts }: any) {

     const likePost = async () => {
          const res = await userLikePost(postData._id);
          if (res?.data.success) {
               setPosts(
                    posts.map((e: any) => {
                         if (e._id == postData._id) {
                              e.isLiked = true;
                              e.likes.push(res.data.user);
                         }
                         return e;
                    })
               );
          }
     };

     const unlikePost = async () => {
          const res = await userUnlikePost(postData._id);
          if (res?.data.success) {
               setPosts(
                    posts.map((e: any) => {
                         if (e._id == postData._id) {
                              e.isLiked = false;
                              e.likes.pop();
                         }
                         return e;
                    })
               );
          }
     };

     return (
          <div className="flex flex-col items-center ml-4 mt-2 cursor-pointer transition duration-200 ease-in-out hover:scale-105">
               {postData.isLiked ? (
                    <>
                         <i
                              onClick={unlikePost}
                              className="fa-solid fa-heart fa-xl text-red-500 transition duration-200 ease-in-out hover:text-red-600"
                         ></i>
                         <p className="mt-2 text-sm text-gray-600 font-medium hover:text-gray-800">
                              Unlike
                         </p>
                    </>
               ) : (
                    <>
                         <i
                              onClick={likePost}
                              className="fa-regular fa-heart fa-xl text-gray-500 transition duration-200 ease-in-out hover:text-red-400"
                         ></i>
                         <p className="mt-2 text-sm text-gray-600 font-medium hover:text-gray-800">
                              Like
                         </p>
                    </>
               )}
          </div>
     );
}

export default Like;
