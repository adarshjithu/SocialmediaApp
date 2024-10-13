import mongoose from "mongoose";
import { AdminInterface, IDashboard, PostInfo } from "../../Inteface/IAdmin";
import { Admin } from "../../Models/adminModel";
import Comment, { IComment } from "../../Models/commentModel";
import { IPost, Post } from "../../Models/postModels";
import { IUser, User } from "../../Models/userModel";
import { IAdminRepository } from "./IAdminRepository";

export class AdminRepository implements IAdminRepository {
    async blockUser(userId: string): Promise<null | Record<string, any>> {
        try {
            await User.updateOne({ _id: userId }, [
                { $set: { isBlocked: { $cond: { if: { $eq: ["$isBlocked", true] }, then: false, else: true } } } },
            ]);
            const res = await User.findOne({ _id: userId });
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async deleteUser<T>(userId: T): Promise<Record<string, any> | null> {
        try {
            await Post.deleteMany({ user: userId });
            await Comment.deleteMany({ userId: userId });
            return await User.deleteOne({ _id: userId });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async getAdminByEmail(email: string): Promise<AdminInterface | null | undefined> {
        try {
            return await Admin.findOne({ email: email });
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllUsers(page: number, type: string, search: string): Promise<any> {
        try {
            let filter = {};
            if (type == "active") filter = { isBlocked: false };
            if (type == "blocked") filter = { isBlocked: true };

            const skip = page * 10;
            return await User.aggregate([{ $match: filter }, { $match: { name: { $regex: search, $options: "i" } } }])
                .skip(skip)
                .limit(10);
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllPosts(page: number, type: string, search: string): Promise<IPost[] | null | undefined> {
        try {
            let filter = {};
            if (type == "active") filter = { isBlocked: false };
            if (type == "blocked") filter = { isBlocked: true };
            if(type=='reported')filter = {reported:{$ne:[]}}

            const skip = page * 10;

            // return await User.find(filter).skip(skip).limit(10);
            const res = await Post.aggregate([
                { $match: filter },
                {
                    $match: { contentType: { $regex: search, $options: "i" } },
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userData",
                    },
                },

                { $unwind: "$userData" },
            ])
                .sort({ _id: -1 })
                .skip(skip)
                .limit(10);
            return res;
        } catch (error) {
            console.log(error as Error);
        }
    }

    async deletePostById(postId: string): Promise<Record<string, any> | null> {
        try {
            await Comment.deleteMany({ postId: postId });
            return await Post.deleteOne({ _id: postId });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async blockPost(postId: string): Promise<null | boolean | undefined> {
        try {
            const post = await Post.findOne({ _id: postId });
            if (post?.isBlocked) await Post.updateOne({ _id: postId }, { $set: { isBlocked: false } });
            else await Post.updateOne({ _id: postId }, { $set: { isBlocked: true } });
            return post?.isBlocked;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async getPostInfo(postId: string): Promise<PostInfo | null> {
        try {
            const allComments = await Comment.find({ postId: postId }).populate("userId");
            const allLikes = await Post.findOne({ _id: postId }).populate("likes");
            return { likes: allLikes, comments: allComments };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async deleteComment(commentId: string) {
        try {
            const commentObjectId = new mongoose.Types.ObjectId(commentId);

            const comment: any = await Comment.findOne({ _id: commentId });
            await Post.updateOne({ _id: comment.postId }, { $pull: { comments: commentObjectId } });

            return await Comment.deleteOne({ _id: commentId });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async getDashBoard(): Promise<IDashboard|null> {
        try {
            const date = new Date();
            date.setHours(0, 0, 0, 0);

            const totalPost = await Post.countDocuments();
            const totalUsers = await User.countDocuments();
            const totalComments = await Comment.countDocuments();
            let likes = await Post.aggregate([{ $unwind: "$likes" }, { $count: "totalLikes" }]);
            const totalLikes = likes[0].totalLikes;
            const todayPosts = await Post.find({ createdAt: { $gt: date } });
            const todayPostCount = todayPosts.length;
            const todayUsers = await User.find({ createdAt: { $gt: date } });
            const todayUserCount = todayUsers.length;

            const monthlyUser = await User.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        userCount: { $sum: 1 }, // Count the number of users for each month
                    },
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
                },
            ]);
            const monthlyUserCount = [
              0,0,0,0,0,0,0,0,0,0,0,0
            ];
            monthlyUser.forEach((obj)=>{
            const userCount = obj.userCount;
            monthlyUserCount[obj._id.month-1] = userCount;
           })
            

           const monthlyPost = await Post.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    postCount: { $sum: 1 }, // Count the number of users for each month
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
            },
        ]);

        const monthlyPostCount = [0,0,0,0,0,0,0,0,0,0,0,0];

        monthlyPost.forEach((obj)=>{
            const postCount = obj.postCount;
            const index = obj._id.month;
            monthlyPostCount[index-1]  = postCount;
        })

        const dashBoardObj={
             totalPost:totalPost,
             totalUsers:totalUsers,
             totalComments:totalComments,
             totalLikes:totalLikes,
             todayPostCount:todayPostCount,
             todayUserCount:todayUserCount,
             monthlyUser:monthlyUserCount,
             monthlyPost:monthlyPostCount
        }
     return dashBoardObj;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async getReports(postId: string): Promise<Record<string,any>|null> {
        try {
           
            const res =  await Post.findOne({_id:postId}).populate("reported.userId")
           return res?.reported;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}
