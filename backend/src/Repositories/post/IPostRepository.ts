import { IPost } from "../../Models/postModels";


export interface IPostRepository {

    createPost(post: any):Promise<Record<string,any>|null|undefined>;

    getAllPost(userId: string): Promise<IPost[] | null | undefined>;

    createVideoPost(postObj: Record<string, any>):Promise<Record<string,any>|null|undefined>;

    likePost(postId: string | any, userId: string | any): Promise<Record<string, any> | null>

    unlikePost(postId: string | any, userId: string | any): Promise<Record<string, any> | null>

    commentPost(commentObj: Record<string, any>): Promise<Record<string, any> | null>;

    getAllComments(postId: string, userId: string): Promise<Record<string, any> | null>

    likeComment(commentId: string, userId: string): Promise<Record<string, any> | null>

    replyComment(commentId: string, data: Record<string, any>): Promise<Record<string, any> | null>
    
    unlikeComment(commentId: string, userId: string): Promise<Record<string, any> | null>


}