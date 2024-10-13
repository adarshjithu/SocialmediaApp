import { FeedbackType } from "../../Inteface/postInterface"
import { IUser } from "../../Models/userModel"

export interface IChatRepository{
     getAllMessages(senderId: string, receiverId: string): Promise<Record<string, any>[] | null>
     getAllUsers(userId: string): Promise<IUser[] | null> 
     searchUsers(query: string, userId: string): Promise<IUser[] | null>
     saveFeedBack(feedback: string, userId: string): Promise<FeedbackType|null>
     getAllFeedback(page:string): Promise<FeedbackType|null> 
     getAllActiveFriends(friends:string[],userId:string): Promise<IUser[]|null>
}