import mongoose from "mongoose";
import { IComment } from "../Models/commentModel";
import { IPost } from "../Models/postModels";
import { IStory } from "../Models/storyModel";
import { IUser } from "../Models/userModel";

export interface ISinglePost{
  comments:IComment[];
      contentType:string;
      createdAt:Date|string;
      description:string;
      images:string[];
      isBlocked:boolean;
      isLiked:boolean;
      likes:string[];
      likesData:IUser[];
      private:boolean;
      updatedAt:boolean;
      user:string;
      userData:IUser
      post:IPost;
  _id:string|mongoose.Types.ObjectId
  }



  export interface PostResponse {
    success?: boolean;
    message?: string;
    posts?: IPost[];
    data?: Record<string, any>;
    userId?: string | number;
}

export interface IGetAllComment {
    success?: boolean;
    message?: string;
    comments?: IComment[];
}

export interface IAllStoryRespose {
    success?: boolean;
    message?: string;
    result?: IStory[];
}

export interface StoryResponse {
    success?: boolean;
    result?: IStory[] | null;
}


export type PostType = Record<string, any> | null;
export type FeedbackType =Record<string, any> | null; 



interface PostInfo {
    likes: any;
    comments: Record<string, any>[];
}