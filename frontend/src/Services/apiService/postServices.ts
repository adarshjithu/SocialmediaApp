import axiosInstance from "../api";
import errorHandler from "../erroHandler";

//Get all the post for user
export const getAllPost = async () => {
    try {
        const response = await axiosInstance.get("/post/posts");

        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//User likepost
export const userLikePost = async (postId: string) => {
    try {
        const response = await axiosInstance.get(`/post/like?postId=${postId}`);

        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//User unLikePost
export const userUnlikePost = async (postId: string) => {
    try {
        const response = await axiosInstance.get(`/post/unlike?postId=${postId}`);

        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//User comment post
export const userCommentPost = async (postId: string, comment: string) => {
    try {
        const response = await axiosInstance.post("/post/comment", { postId: postId, comment: comment });

        return response;
    } catch (error) {
        errorHandler(error);
    }
};
//getAllComments of a specific post
export const getAllComments = async (postId: string) => {
    try {
        const response = await axiosInstance.get(`/post/comments?postId=${postId}`);
        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//like comment
export const userLikeComment = async (commentId: string) => {
    try {
        console.log(commentId)
        const response = await axiosInstance.get(`/post/comment/like?commentId=${commentId}`);
        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//unlike comment
export const userUnlikeComment = async (commentId: string) => {
    try {
        console.log("unlike");
        const response = await axiosInstance.get(`/post/comment/unlike?commentId=${commentId}`);
        return response;
    } catch (error) {
        errorHandler(error);
    }
};
//Reply comment
export const replyComment = async (text: string, commentId: string) => {
    try {
        const response = await axiosInstance.post(`/post/comment/reply`, { text: text, commentId: commentId});
        return response;
    } catch (error) {
        errorHandler(error);
    }
};
//Feeling post
export const feelingPost = async (text: string) => {
    try {
        const response = await axiosInstance.post(`/post/feeling/`, { text: text });
        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//Feeling post
export const getAllStory = async () => {
    try {
        const response = await axiosInstance.get(`/post/story/`);
        return response;
    } catch (error) {
        errorHandler(error);
    }
};
//likeStory
export const likeStory = async (storyId: string, expiresAt: any) => {
    try {
        console.log(storyId, expiresAt);
        const response = await axiosInstance.patch(`/post/story/like`, { storyId, expiresAt });
        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//Get Replies
export const getReplies = async (replyId: string) => {
    try {
        const response = await axiosInstance.get(`/post/comment/reply?replyId=${replyId}`);
        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//Get post by Id
export const getPostById = async (postId: string) => {
    try {
        const response = await axiosInstance.get(`/post/post?postId=${postId}`);
        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//Get post by Id
export const getShare = async () => {
    try {
        const response = await axiosInstance.get(`/post/share`);
        return response;
    } catch (error) {
        errorHandler(error);
    }
};


export const likeReplyComment = async(commentId:string,type:string)=>{
    try {
        const response = await axiosInstance.patch(`/post/comment/reply/like`,{commentId:commentId,type:type});
        return response;
    } catch (error) {
        errorHandler(error);
    }

}


//Reply RepliedComment

export const replyRepliedComment = async (text: string, commentId: string) => {
    try {
        const response = await axiosInstance.post(`/post/comment/reply/reply`, { text: text, commentId: commentId});
        return response;
    } catch (error) {
        errorHandler(error);
    }
};



export const reportPost = async(postId:string,reason:string)=>{
    try {
        const response = await axiosInstance.post(`/post/report`,{postId,reason});
        return response;
     
    } catch (error) {
        errorHandler(error);
    }

}

