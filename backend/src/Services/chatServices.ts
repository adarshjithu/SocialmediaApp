import { StringExpression } from "mongoose";
import { IMessage } from "../Models/MessageModel";
import { IUser } from "../Models/userModel";
import { ChatRepository } from "../Repositories/Chat/chatRepository";

export class ChatServices {
    constructor(public chatRepository: ChatRepository) {}

    // For gettting all the messages
    async getAllMessages(senderId: string, receiverId: string,page:string):Promise<Record<string,any>|null> {
        try {
            return await this.chatRepository.getAllMessages(senderId,receiverId,page)
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

        // For fetching all the users related to message
        async getAllUsers(userId: string):Promise<IUser[]|null> {
            try {
                return await this.chatRepository.getAllUsers(userId)
            } catch (error) {
                console.log(error as Error);
                return null;
            }
        }


         // Search users for chat
         async searchUser(query: string,userId:string):Promise<IUser[]|null> {
            try {
             return await  this.chatRepository.searchUsers(query,userId)
            } catch (error) {
                console.log(error as Error);
                return null;
            }
        }

        
         // Search users for chat
         async sendFeedBack(feedback: string,userId:string):Promise<Record<string,any>|null> {
            try {
             return await this.chatRepository.saveFeedBack(feedback,userId)
            } catch (error) {
                console.log(error as Error);
                return null;
            }
        }

         // Get feedback
         async getFeedback(page:string):Promise<Record<string,any>|null> {
            try {
                return this.chatRepository.getAllFeedback(page)
           
            } catch (error) {
                console.log(error as Error);
                return null;
            }
        }

        // Get feedback
        async getAllActiveFriends(friends:string[],userId:string):Promise<Record<string,any>|null> {
            try {
                return await this.chatRepository.getAllActiveFriends(friends,userId)
           
            } catch (error) {
                console.log(error as Error);
                return null;
            }
        }

        // Get feedback
        async clearAllChat(senderId:string,receiverId:string):Promise<Record<string,any>|null> {
            try {
              return await this.chatRepository.clearAllChat(senderId,receiverId)
           
            } catch (error) {
                console.log(error as Error);
                return null;
            }
        }
                //Get notification count
                async deleteMessage(messageId: string): Promise<Record<string, any> | null> {
                    try {
                        return await this.chatRepository.deleteMessageById(messageId);
                    } catch (error) {
                        console.log(error as Error);
                        return null;
                    }
                }
}
