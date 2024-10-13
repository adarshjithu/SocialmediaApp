import axiosInstance from "../api";
import errorHandler from "../erroHandler";

//Get all users
export const getAllMessages = async (senderId: string, receiverId: string) => {
    try {
        const response = await axiosInstance.get(`chat/messages?senderId=${senderId}&receiverId=${receiverId}`);

        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//Get all users
export const getAllChatedUsers = async () => {
    try {
        const response = await axiosInstance.get(`chat/users`);

        return response;
    } catch (error) {
        errorHandler(error);
    }
};

export const searchUserForChat = async (query: string) => {
    try {
        const response = await axiosInstance.get(`chat/users/search?query=${query}`);

        return response;
    } catch (error) {
        errorHandler(error);
    }
};

export const sendFeedback = async (feedback: string) => {
    try {
        const response = await axiosInstance.post(`chat/feedback`, { feedback: feedback });

        return response;
    } catch (error) {
        errorHandler(error);
    }
};

export const getFeedback = async (page: number) => {
    try {
        const response = await axiosInstance.get(`chat/feedback?page=${page}`);

        return response;
    } catch (error) {
        errorHandler(error);
    }
};

export const getActiveFriends = async (friends: string[]) => {
    try {
        const response = await axiosInstance.post(`chat/active-friends`, { friends: friends });

        return response;
    } catch (error) {
        errorHandler(error);
    }
};


export const clearAllChat = async (senderId:string,receiverId:string) => {
     try {
         const response = await axiosInstance.delete(`chat/clear?senderId=${senderId}&receiverId=${receiverId}`);
 
         return response;
     } catch (error) {
         errorHandler(error);
     }
 };
