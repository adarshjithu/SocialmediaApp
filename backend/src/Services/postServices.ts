
import { PostRepository } from "../Repositories/post/postRepository";
import { uploadImageToCloudinary } from "../Utils/upload";
import { MESSAGES } from "../Constants/messages";
import { IPostServices } from "./interface/IPostServices";
import UserRepository from "../Repositories/user/userRepository";
import { IAllStoryRespose, IGetAllComment, ISinglePost, PostResponse, PostType } from "../Inteface/postInterface";
import { ShareResponse } from "../Inteface/IUser";
import { IComment } from "../Models/commentModel";
const userRepository = new UserRepository();

export class PostServices implements IPostServices {
    constructor(public postRepository: PostRepository) {}

    //Upload image
    async uploadImage<T>(files: T, user: string, description: string): Promise<PostResponse> {
        try {
            const results = await uploadImageToCloudinary(files);
            if (!results.success) return { success: false, message: "Uploading failed" };
            const images = results?.results?.map((obj: any) => obj?.url);
            const postObj = {
                user: user,
                description: description,
                contentType: "image",
                images: images,
            };

            const isUploaded = await this.postRepository.createPost(postObj);
            if (isUploaded) {
                return { success: true, message: MESSAGES.UPLOAD.UPLOAD_SUCCESS, data: results };
            } else {
                return { success: false, message: MESSAGES.UPLOAD.UPLOAD_FAIL };
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.UPLOAD.UPLOAD_FAIL };
        }
    }

    //Getting all the post of a specific user
    async getAllPosts(userId: string): Promise<PostResponse | null> {
        try {
            const posts = await this.postRepository.getAllPost(userId);

            if (posts) return { success: true, posts: posts };
            else return { success: false };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async createVideoPost(video: string, description: string, user: string): Promise<PostResponse> {
        try {
            const postObj = {
                user: user,
                description: description,
                contentType: "video",
                video: video,
            };

            const result = await this.postRepository.createVideoPost(postObj);
            if (result) return { success: true, message: MESSAGES.UPLOAD.UPLOAD_VIDEO_SUCCESS };
            else return { success: false, message: MESSAGES.UPLOAD.UPLOAD_VIDEO_FAIL };
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.UPLOAD.UPLOAD_VIDEO_FAIL };
        }
    }

    //Like post
    async likePost(postId: string | any, userId: string): Promise<PostResponse> {
        try {
            // Taking post details for storing post data in the notification
            const post = await this.postRepository.findPostById(postId);
            // Checking current user likes the his own post

            if (String(post.user) !== String(userId)) {
                await userRepository.addNotification(post.user, { userId: userId, message: "like", postId: postId, image: post.images[0],data:'',createdAt:new Date });
            }
            const res = await this.postRepository.likePost(postId, userId);
            if (res) return { success: true, userId: res.userId };
            else return { success: false, message: MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
        } catch (error) {
            console.log(error as Error);

            return { success: false, message: MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
        }
    }

    //unLike post
    async unlikePost(postId: string, userId: string): Promise<PostResponse> {
        try {
            const res = await this.postRepository.unlikePost(postId, userId);
            if (res) return { success: true, userId: res.userId };
            else return { success: false, message: MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
        }
    }

    //comment post
    async commentPost(postId: string, comment: string, userId: string): Promise<PostType> {
        try {
            // Taking post details for storing post data in the notification
            const post = await this.postRepository.findPostById(postId);
            // Checking current user likes the his own post
            if (String(post.user) !== String(userId)) {

                await userRepository.addNotification(post.user, { userId: userId, message: "comment", postId: postId, image: post.images[0],data:comment,createdAt:new Date() });
            }
            const commentObj = { postId: postId, userId: userId, content: comment, likes: [], replies: [] };
            const result = await this.postRepository.commentPost(commentObj);
            return result;
        } catch (error) { 
            console.log(error as Error);
            return { success: false };
        }
    }

    //Get all comments for a post
    async getAllComments<T>(postId: string, userId: string): Promise<IGetAllComment | null> {
        try {
            const result = await this.postRepository.getAllComments(postId, userId);
            if (result) return { success: true, comments: result };
            else return { success: false, message: MESSAGES.UPLOAD.UPLOAD_WENT_WRONG };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Like comment
    async likeComment(commentId: string , userId: string): Promise<PostType> {
        try {

            const commentData = await this.postRepository.findCommentById(commentId);
            const comment = commentData?.content;
            const postId  = commentData?.postId
            const postData = await this.postRepository.findPostById(String(postId));
            const image =postData.images[0];
            const postedUser = postData.user;
            //Create notification object for storing notification
            const notificationObj ={
                userId:userId,message:"like comment",postId:postId,image,data:comment,createdAt:new Date()
            }
            // Storing notification
            if (String(postedUser) !== String(userId)) {
                await userRepository.addNotification(postedUser,notificationObj);
            }
 
            const result = await this.postRepository.likeComment(commentId, userId);
            if (result) return { success: true };
            else return { success: false };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Unlike comment
    async unlikeComment(commentId: string, userId: string): Promise<PostType> {
        try {
            const result = await this.postRepository.unlikeComment(commentId, userId);
            if (result) return { success: true };
            else return { success: false };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    //reply comment
    async replyComment(text: string, commentId: string, userId: string): Promise<PostType> {
        try {
            const commentData = await this.postRepository.findCommentById(commentId);
            const comment = commentData?.content;
            const postId  = commentData?.postId
            const postData = await this.postRepository.findPostById(String(postId));
            const image =postData.images[0];
            const postedUser = postData.user;
            //Create notification object for storing notification
            const notificationObj ={
                userId:userId,message:"reply comment",postId:postId,image,data:comment,createdAt:new Date()
            }
            // Storing notification
            if (String(postedUser) !== String(userId)) {
                await userRepository.addNotification(postedUser,notificationObj);
            }

            const replyObj = { postId: null, userId: userId, content: text, likes: [] };
            const res = await this.postRepository.replyComment(commentId, replyObj);
            if (res) return { success: true, result: res };
            else return { success: false };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    //Post feeling
    async postFeeling(text: string, userId: string): Promise<PostType> {
        try {
            const postObj = {
                user: userId,
                description: text,
                contentType: "text",
            };
            const res = await this.postRepository.createPost(postObj);
            if (res) return { success: true, message: MESSAGES.POST.SUCCESS };
            else return { success: false, message: MESSAGES.POST.FAILED };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Upload image
    async uploadStoryImage<T>(files: T, user: string): Promise<PostType> {
        try {
            const results = await uploadImageToCloudinary(files);
            if (!results.success) return { success: false, message: "Uploading failed" };
            const images = results?.results?.map((obj: any) => obj?.url);
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // Set expiration time to 24 hours from now
            const storyObj = {
                userId: user,
                stories: [{ contentType: "image", likes: [], image: images?.[0], expiresAt: expiresAt }],
            };

            const isUploaded = await this.postRepository.createStory(storyObj);
            if (isUploaded) {
                return { success: true, message: MESSAGES.UPLOAD.UPLOAD_SUCCESS, data: isUploaded };
            } else {
                return { success: false, message: MESSAGES.UPLOAD.UPLOAD_FAIL };
            }
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Upload image
    async getAllStories(userId: string): Promise<IAllStoryRespose | undefined> {
        try {
            const res = await this.postRepository.getAllStories(userId);
            if (res) return { success: true, result: res };
            else return { success: false };
        } catch (error) {
            console.log(error as Error);
            {
                success: false;
            }
        }
    }

    //Like Story
    async likeStory(storyId: string, expiresAt: string, userId: string): Promise<{ success: boolean }> {
        try {
            const result = await this.postRepository.likeStory(storyId, expiresAt, userId);
            if (result) return { success: true };
            else {
                return { success: false };
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false };
        }
    }

    //Get reply
    async getReply(replyId: string, userId: string): Promise<IComment|null> {
        try {
            return await this.postRepository.getAllReply(replyId, userId);
        } catch (error) {
            console.log(error as Error);
            return null
        }
    }

     //Get post
     async getPost(postId:string,userId:string): Promise<ISinglePost[]|null> {
        try {
            return await this.postRepository.getPostById(postId,userId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Get all the users for sharing post
    async getUsersForShare(userId:string): Promise<ShareResponse|null> {
        try {
            const res= await this.postRepository.getAllUsersForShare(userId);
          
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Delete post
    async deletePost(postId:string): Promise<PostType|null> {
        try {
            const res= await this.postRepository.deletePostById(postId);
          
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Like replied comment
    async likeRepliedComment(userId:string,commentId:string,type:string): Promise<PostType|null> {
        try {
            const res= await this.postRepository.likeRepliedComment(userId,commentId,type);
          
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Reply Replied Comment
    async replyRepliedComment(text:string,commentId:string,userId:string): Promise<PostType|null> {
        try {
            const replyObj = { postId: null, userId: userId, content: text, likes: [] };
            const res = await this.postRepository.replyComment(commentId, replyObj);
            if (res) return { success: true, result: res };
            else return { success: false };
        
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Reply Replied Comment
    async reportPost(userId:string,postId:string,reason:string): Promise<PostType|null> {
        try {
       
           
            return await this.postRepository.reportPost(userId,postId,reason);
        
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}
