import axiosInstance from "../api";

import errorHandler from "../erroHandler";

//Get all users
export const getAllUsers = async (page: number, type: string,search:string) => {
     try {
          const response = await axiosInstance.get(`/admin/users?page=${page}&type=${type}&search=${search}`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};
//Block user
export const blockUser = async (obj: Record<string, any>) => {
     try {
          const response = await axiosInstance.get(`/admin/user/block?userId=${obj._id}`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};

//Block user
export const deleteUser = async (obj: Record<string, any>) => {
     console.log("call");
     try {
          const response = await axiosInstance.delete(`/admin/user/delete?userId=${obj._id}`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};

//LoginAdmin
export const adminLogin = async (arg: Object) => {
     try {
          const response = await axiosInstance.post(`admin/login`, arg);
          console.log(response, "resonse");
          return response.data;

          // return response.data;
     } catch (error) {
          errorHandler(error);
     }
};
//Logout Admin
export const logoutAdmin = async () => {
     try {
          const response = await axiosInstance.get(`admin/logout`);
          console.log(response, "resonse");
          return response.data;

          // return response.data;
     } catch (error) {
          errorHandler(error);
     }
};

//Get all post
export const getAllPosts = async (page: number, type: string,search:string) => {
     try {
          const response = await axiosInstance.get(`/admin/posts?page=${page}&type=${type}&search=${search}`);

          return response;
     } catch (error) {
          errorHandler(error); 
     } 
};

//Get delete post
export const deletePost = async (postId: string) => {
     try {
          const response = await axiosInstance.delete(`/admin/post?postId=${postId}`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};
//block post
export const blockPost = async (postId: string) => {
     try {
          const response = await axiosInstance.get(`/admin/post/block?postId=${postId}`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};

export const getAllLikesAndComments = async (postId: string) => {
     try {
          const response = await axiosInstance.get(`/admin/post/getpostinfo?postId=${postId}`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};

export const deleteComment = async (commentId: string) => {
     try {
          const response = await axiosInstance.delete(`/admin/post/comment/delete?commentId=${commentId}`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};

export const dashBoard = async () => {
     try {
          const response = await axiosInstance.get(`/admin/dashboard`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};
export const reportDetails = async (postId:string) => {
     try {
          const response = await axiosInstance.get(`/admin/report?postId=${postId}`);

          return response;
     } catch (error) {
          errorHandler(error);
     }
};

