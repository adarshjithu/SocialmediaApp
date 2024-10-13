import mongoose from "mongoose";
import { IMessage, Message } from "../../Models/MessageModel";
import { IUser, User } from "../../Models/userModel";
import Feedback from "../../Models/feedbackModel";
import { FeedbackType } from "../../Inteface/postInterface";
import { IChatRepository } from "./IChatRepository";

export class ChatRepository implements IChatRepository {
    constructor() {}

    async getAllMessages(senderId: string, receiverId: string): Promise<Record<string, any>[] | null> {
        try {

            await Message.updateMany({senderId:receiverId,receiverId:senderId},{$set:{read:true}})
            const messages = await Message.find({
                $or: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            }).sort({ createdAt: 1 });

            return messages;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async getAllUsers(userId: string): Promise<IUser[] | null> {
        try {
            const res = await Message.aggregate([
                {
                    $match: {
                        $or: [{ senderId: userId }, { receiverId: userId }],
                    },
                },
                {
                    $sort: { timestamp: -1 }, // Sort by the latest message (ensure `createdAt` field exists)
                },
                {
                    $group: {
                        _id: {
                            $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"], // Group by the other user (sender or receiver)
                        },
                        lastMessage: { $first: "$$ROOT" }, // Get the most recent message
                    },
                },
                {
                    $lookup: {
                        from: "users", // Assuming your user collection is called 'users'
                        localField: "_id",
                        foreignField: "_id",
                        as: "otherUser",
                    },
                },
                {
                    $unwind: "$otherUser", // Unwind the user details
                },

                {
                    $project: {
                        otherUser: 1, // Include the user details
                        lastMessage: 1, // Include the last message details
                    },
                },
            ]);

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Search Users for to chat
    async searchUsers(query: string, userId: string): Promise<IUser[] | null> {
        try {
            const res = await User.find({ name: { $regex: query, $options: "i" } });

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Search Users for to chat
    async saveFeedBack(feedback: string, userId: string): Promise<FeedbackType | null> {
        try {
            return await Feedback.create({ userId, feedback });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all feedback
    async getAllFeedback(page: string): Promise<FeedbackType | null> {
        try {
            return await Feedback.find({})
                .limit(Number(page) * 5)
                .populate("userId");
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all active friends
    async getAllActiveFriends(friends: string[], userId: string): Promise<IUser[] | null> {
        try {
            const res = await User.find({ _id: { $in: friends, $ne: userId } });

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Clear all the chat
    async clearAllChat(senderId:string,receiverId:string): Promise<Record<string,any> | null> {
        try {
            const res = await Message.deleteMany({$or:[{senderId:senderId,receiverId:receiverId},
                {senderId:receiverId,receiverId:senderId}
            ]})

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}
