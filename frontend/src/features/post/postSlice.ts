import { createSlice } from "@reduxjs/toolkit";
import { IPost } from "../../interfaces/Interface";

interface IInitialState {
    allPostData: IPost[];
    comments: [];
    replies: [];
    repliesOfReplies: [];
    repliesOfRepliesOfReplies: [];
}

const initialState: IInitialState = {
    allPostData: [],
    comments: [],
    replies: [],
    repliesOfReplies: [],
    repliesOfRepliesOfReplies: [],
};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setAllPosts: (state, action) => {
            state.allPostData = action.payload;
        },
        likePostAction: (state, action) => {
            state.allPostData = state.allPostData.map((obj: IPost) => {
                if (obj?._id == action.payload.postId) {
                    obj.isLiked = !obj.isLiked;
                    obj.likes?.push(action.payload.userId);
                }
                return obj;
            });
        },
        unlikePostAction: (state, action) => {
            state.allPostData = state.allPostData.map((obj: IPost) => {
                if (obj._id === action.payload.postId) {
                    obj.likes = obj.likes?.filter((id) => id !== action.payload.userId);
                    obj.isLiked = !obj.isLiked;
                }
                return obj;
            });
        },
        addCommentsAction: (state, action) => {
            state.comments = action.payload;
        },
        setRepliesAction: (state, action) => {
            state.replies = action.payload;
        },
        setRepliesOfRepliesAction: (state, action) => {
            state.repliesOfReplies = action.payload;
        },
        setRepliesOfRepliesOfRepliesAction: (state, action) => {
            state.repliesOfRepliesOfReplies = action.payload;
        },
    },
});

export const {
    setAllPosts,
    likePostAction,
    unlikePostAction,
    addCommentsAction,
    setRepliesAction,
    setRepliesOfRepliesAction,
    setRepliesOfRepliesOfRepliesAction,
} = postSlice.actions;
export default postSlice.reducer;
