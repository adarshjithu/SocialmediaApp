import mongoose from "mongoose";
import Comment, { IComment } from "../../Models/commentModel";
import { IPost, Post } from "../../Models/postModels";
import { IPostRepository } from "./IPostRepository";
import Story, { IStory } from "../../Models/storyModel";
import { User } from "../../Models/userModel";
import Follow from "../../Models/FollowModel";
import { ISinglePost, PostType } from "../../Inteface/postInterface";
import { ShareResponse } from "../../Inteface/IUser";

export class PostRepository implements IPostRepository {
    //Create Post
    async createPost(post: any): Promise<PostType> {
        try {
            return await Post.create(post);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Get all the post
    async getAllPost(userId: string): Promise<IPost[] | null> {
        try {
            const follow = await Follow.findOne({ userId: userId });
            const followArr: any[] = [userId];
            follow?.following.forEach((data) => [followArr.push(data)]);
            follow?.followers.forEach((data) => [followArr.push(data)]);

            const res = await Post.aggregate([
                { $match: { isBlocked: false } },
                { $match: { user: { $in: followArr } } },
                {
                    $addFields: {
                        isLiked: { $in: [userId, "$likes"] },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "likes",
                        foreignField: "_id",
                        as: "likesData",
                    },
                },
                { $unwind: "$userData" },
            ]).sort({ _id: -1 });

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //For create post as video
    async createVideoPost(postObj: Record<string, any>): Promise<PostType> {
        try {
            return await Post.create(postObj);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Like post
    async likePost(postId: string | any, userId: string | any): Promise<{ success: boolean; userId: string } | null> {
        try {
            const res = await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
            return { success: true, userId: userId };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Unlike post
    async unlikePost(postId: string | any, userId: string | any): Promise<{ success: boolean; userId: string } | null> {
        try {
            const res = await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            return { success: true, userId: userId };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Comment post
    async commentPost(commentObj: Record<string, any>): Promise<PostType> {
        try {
            const res = new Comment(commentObj);
            await res.save();
            await Post.updateOne(
                { _id: commentObj.postId },
                {
                    $push: { comments: res._id },
                }
            );
            const result = await Comment.findOne({ _id: res._id }).populate("userId");

            return result;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Get all comments
    async getAllComments(postId: string, userId: string): Promise<IComment[] | null> {
        try {
            // const res = await Comment.find({ postId: postId })
            const post = new mongoose.Types.ObjectId(postId);
            const res = await Comment.aggregate([
                { $match: { postId: post } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $addFields: {
                        isLiked: { $in: [userId, "$likes"] },
                    },
                },
                {
                    $unwind: "$userData",
                },
            ]).sort({ _id: -1 });

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Like comment
    async likeComment(commentId: string, userId: string): Promise<PostType> {
        try {
            const res = await Comment.updateOne({ _id: commentId }, { $push: { likes: userId } });
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Unlike Comment
    async unlikeComment(commentId: string, userId: string): Promise<PostType> {
        try {
            const res = await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Unlike Comment
    async replyComment(commentId: string, data: Record<string, any>): Promise<PostType> {
        try {
            const newComment = new Comment(data);
            await newComment.save();
            await Comment.updateOne({ _id: commentId }, { $push: { replies: newComment } });
            const res = await this.getAllReply(commentId, data.userId);

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    //Create Story
    async createStory(storyObj: Record<string, any>): Promise<PostType> {
        try {
            const isExistsStory = await Story.findOne({ userId: storyObj.userId });
            if (isExistsStory) {
                await Story.updateOne(
                    { userId: storyObj.userId },
                    {
                        $push: {
                            stories: {
                                contentType: "image",
                                likes: [],
                                image: storyObj.stories[0].image,
                                expiresAt: storyObj.stories[0].expiresAt,
                            },
                        },
                    }
                );
                return await Story.findOne({ userId: storyObj.userId }).populate("userId");
            } else {
                const newStory = new Story(storyObj);
                await newStory.save();
                return await Story.findOne({ userId: storyObj.userId }).populate("userId");
            }
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Create Story
    async getAllStories(userId: string): Promise<IStory[] | null> {
        try {
            const followData = await Follow.findOne({ userId: userId }).lean();

            let followArr = [...(followData?.following || []), ...(followData?.followers || [])];

            const res = await Story.find({ userId: { $in: followArr } })
                .populate("userId")
                .sort({ _id: -1 })
                .lean();

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Like story
    async likeStory(storyId: string, expiresAt: string, userId: string): Promise<PostType> {
        try {
            const res = await Story.updateOne(
                { _id: storyId, "stories.expiresAt": expiresAt },
                {
                    $addToSet: { "stories.$.likes": userId },
                }
            );
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Like story
    async getAllReply(replyId: string, userId: string): Promise<any> {
        try {
            const comments = await Comment.findOne({ _id: replyId })
                .sort({ createdAt: -1 })
                .populate({
                    path: "replies",
                    populate: {
                        path: "userId",
                        select: "name email",
                    },
                })
                .lean();

            if (comments?.replies) {
                comments.replies = comments.replies.map((obj: any) => {
                    obj.isLiked = obj.likes.some((like: any) => like.equals(new mongoose.Types.ObjectId(userId)));
                    return obj;
                });
            }

            return comments;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Find comment byid
    async findPostById(postId: string): Promise<any> {
        try {
            return await Post.findOne({ _id: postId });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async findCommentById(commentId: String): Promise<IComment | null> {
        try {
            return await Comment.findOne({ _id: commentId });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async getPostById(postId: string, userId: string): Promise<ISinglePost[] | null> {
        try {
            const res = await Post.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(postId) } },

                { $match: { isBlocked: false } },
                {
                    $addFields: {
                        isLiked: { $in: [userId, "$likes"] },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "likes",
                        foreignField: "_id",
                        as: "likesData",
                    },
                },
                { $unwind: "$userData" },
            ]);

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async getAllUsersForShare(userId: String): Promise<ShareResponse | null> {
        try {
            const res = await Follow.findOne({ userId: userId }, { requests: 0 }).populate("following").populate("followers");
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async deletePostById(postId: string): Promise<PostType | null> {
        try {
            return Post.deleteOne({ _id: postId });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async likeRepliedComment(userId: string, commentId: string, type: string): Promise<PostType | null> {
        try {
            if (type == "push") return await Comment.updateOne({ _id: commentId }, { $push: { likes: userId } });
            else return await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async reportPost(userId: string, postId: string, reason: string): Promise<PostType | null> {
        try {
            const reportObj = {
                userId: userId,
                reason: reason,
                createdAt: new Date(),
            };
            console.log(reportObj);
            return await Post.updateOne({ _id: postId }, { $push: { reported: reportObj } });
        } catch (error: any) {
            console.log(error.message);
            return null;
        }
    }
}
