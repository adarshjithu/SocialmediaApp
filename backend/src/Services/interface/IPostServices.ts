import { PostResponse } from "../../Inteface/postInterface";


export interface IPostServices{
    uploadImage<T>(files: T, user: string, description: string): Promise<any | null> ;
    getAllPosts(userId: string): Promise<PostResponse | null | undefined> 
    createVideoPost(video: string, description: string, user: string): Promise<any | null>
    likePost(postId: string | any, userId: string): Promise<any | null>
    commentPost(postId: string, comment: string, userId: string): Promise<Record<string, any> | null>
    getAllComments<T>(postId: any,userId:string): Promise<Record<string, any> | null | undefined>
    likeComment(commentId: string | any, userId: string): Promise<Record<string, any> | null | undefined>
    unlikeComment(commentId: string | any, userId: string): Promise<Record<string, any> | null > 
    replyComment(text: string,commentId:string, userId: string,postId:string): Promise<Record<string, any> | null > 

}