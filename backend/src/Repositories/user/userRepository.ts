import { IUser, User } from "../../Models/userModel";
import { IUserRepository } from "./IUserRepository";
import Follow, { IFollow } from "../../Models/FollowModel";
import mongoose from "mongoose";
import { UserReponse } from "../../Services/userService";
import { Post } from "../../Models/postModels";
import Notification from "../../Models/notificationModel";
import { IEditProfile, INotification, INotificationObj } from "../../Inteface/userInterfaces";
import Birthday from "../../Models/birthdayModel";
import TempOTP from "../../Models/OTPmodel";

type ResponseType = Record<string, any> | null;

class UserRepository implements IUserRepository {
    // For checking user exist or not
    async emailExist(email: string): Promise<UserReponse> {
        try {
            const userFound = await User.findOne({ email: email });
            return userFound as IUser;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // To Insert Userdata inside database
    async saveUser(data: Record<string, any>): Promise<Partial<IUser> | null> {
        try {
            const userObj = { name: data.name, email: data.email, phonenumber: data.phonenumber, password: data.password };
            const newUser = new User(userObj);
            await newUser.save();

            return { name: newUser.name, email: newUser.email, phonenumber: newUser.phonenumber, _id: newUser._id };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    // To check existing user with email
    async checkEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email: email });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Getting user data with _id
    async findById(id: string): Promise<IUser | null> {
        try {
            return await User.findById(id);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all the user data with email or phonenumber
    async findByEmailOrPhone(data: Record<string, any>): Promise<any> {
        try {
            if (data.phonenumber) {
                return await User.findOne({ phonenumber: data.phonenumber });
            } else {
                return await User.findOne({ email: data.email });
            }
        } catch (error) {
            return null;
        }
    }

    // Update password of user with userid
    async updatePassword(newPassword: string, userId: string): Promise<ResponseType> {
        try {
            return await User.updateOne(
                { _id: userId },
                {
                    $set: { password: newPassword },
                }
            );
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    // Create user
    async createUser(userData: any): Promise<Record<string, any> | null> {
        try {
            await User.updateOne({ email: userData.email }, { $set: userData }, { upsert: true, new: true });
            return await User.findOne({ email: userData.email });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    // Get suggessions

    async getSuggessions(userId: string): Promise<IUser[] | null> {
        try {
            // If following is empty we can provide all users
            const followData = await Follow.findOne({ userId: userId });
            if (followData?.following.length == 0 || !followData) {
                return await User.find({}).limit(3);
            }

            const following = followData.following || [];

            const users = await User.aggregate([
                {
                    $match: {
                        _id: { $nin: [...following, userId] }, // Exclude followed users and the current user
                    },
                },
                {
                    $sample: { size: 3 }, // Randomly select 10 users
                },
            ]);

            return users;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async unFollow(followerId: string, userId: string): Promise<Record<string, any> | null> {
        try {
            console.log("unfollow");
            const fId = new mongoose.Types.ObjectId(followerId);
            const uId = new mongoose.Types.ObjectId(userId);
            await Follow.updateOne({ userId: fId }, { $pull: { requests: uId } });
            await Follow.updateOne({ userId: fId }, { $pull: { followers: uId } });
            await Follow.updateOne({ userId: uId }, { $pull: { following: fId } });

            return { success: true };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Search User
    async searchUser(query: string, userId: string): Promise<Record<string, any> | null> {
        try {
            const users = await User.aggregate([
                {
                    $match: {
                        name: { $regex: query, $options: "i" }, // Search users by name (case-insensitive)
                    },
                },
                {
                    $match: { _id: { $ne: userId } },
                },
                {
                    $lookup: {
                        from: "follows", // The Follow collection name (Make sure it's correct)
                        let: { userId: "$_id" }, // Pass the userId of each user
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] }, // Current user
                                            { $in: ["$$userId", "$following"] }, // Check if this user is in the following array
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "isFollowingStatus",
                    },
                },
                {
                    $addFields: {
                        isFollowing: {
                            $cond: { if: { $gt: [{ $size: "$isFollowingStatus" }, 0] }, then: true, else: false }, // If there are results in the lookup, set isFollowing to true
                        },
                    },
                },
                {
                    $project: {
                        name: 1, // Include the fields you want
                        image: 1,
                        isFollowing: 1, // Include the computed isFollowing field
                    },
                },
            ]);

            return users;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Get Profile
    async getProfile(userId: string): Promise<Record<string, any> | null> {
        try {
            const user = (await User.findOne({ _id: userId }).lean()) as IUser;
            user.password = "";

            const post = await Post.find({ user: userId }).sort({ _id: -1 });

            return { user: user, posts: post };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Add Followers
    async addFollowers(followerId: string, userId: string): Promise<Record<string, any> | null> {
        try {
            const fId = new mongoose.Types.ObjectId(followerId);
            const uId = new mongoose.Types.ObjectId(userId);
            return await Follow.updateOne({ userId: followerId }, { $addToSet: { followers: uId } }, { upsert: true });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Add Followers
    async addFollowing(followerId: string, userId: string): Promise<Record<string, any> | null> {
        try {
            const fId = new mongoose.Types.ObjectId(followerId);
            const uId = new mongoose.Types.ObjectId(userId);
            return await Follow.updateOne({ userId: userId }, { $addToSet: { following: fId } }, { upsert: true });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Add Request
    async addRequest(followerId: string, userId: string): Promise<Record<string, any> | null> {
        try {
            const fId = new mongoose.Types.ObjectId(followerId);
            const uId = new mongoose.Types.ObjectId(userId);
            return await Follow.updateOne({ userId: followerId }, { $addToSet: { requests: { userId: uId } } }, { upsert: true });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Add notification
    async addNotification(userId: string, notificationObj: INotificationObj): Promise<Record<string, any> | null> {
        try {
            return Notification.updateOne({ userId: userId }, { $addToSet: { notifications: notificationObj } }, { upsert: true });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Get Notifications
    async getNotification(userId: string, page: string): Promise<Record<string, any> | null> {
        try {
            const notification = await Notification.aggregate([
                {
                    $match: { userId: userId },
                },
                {
                    $unwind: "$notifications",
                },

                {
                    $project: { notifications: 1, _id: 0 },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "notifications.userId",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $sort: { "notifications.createdAt": -1 },
                },
                { $limit: Number(page) * 10 },
            ]);

            return notification;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Get Notifications
    async getAllRequest(userId: string): Promise<Record<string, any> | null> {
        try {
            const res = await Follow.findOne({ userId: userId }).populate("requests.userId");

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Remove the request from userRequest array
    async removeRequest(userId: string, followerId: string): Promise<Record<string, any> | null> {
        try {
            const res = await Follow.updateOne({ userId: userId }, { $pull: { requests: { userId: followerId } } });
            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Clear all the notifications of a user
    async clearAllNotifications(userId: string): Promise<Record<string, any> | null> {
        try {
            return await Notification.updateOne({ userId: userId }, { $set: { notifications: [] } });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Remove followers
    async removeFollower(userId: string, followerId: string): Promise<Record<string, any> | null> {
        try {
            await Follow.updateOne({ userId: userId }, { $pull: { followers: followerId } });
            return await Follow.updateOne({ userId: followerId }, { $pull: { following: userId } });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Remove following
    async removeFollowing(userId: string, followerId: string): Promise<Record<string, any> | null> {
        try {
            return await Follow.updateOne({ userId: followerId }, { $pull: { following: userId } });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Find follow by id
    async findFollowById(userId: string): Promise<Record<string, any> | null> {
        try {
            return await Follow.findOne({ userId: userId });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Find follow by id
    async updateProfilePicture(userId: string, image: string): Promise<Record<string, any> | null> {
        try {
            return await User.updateOne({ _id: userId }, { $set: { image: image } });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Update Bio
    async updateBio(userId: string, bio: string): Promise<Record<string, any> | null> {
        try {
            return await User.updateOne({ _id: userId }, { $set: { bio: bio } });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Update Profile
    async updateProfile(userId: string, profileData: IEditProfile): Promise<Record<string, any> | null> {
        try {
            return await User.findByIdAndUpdate({ _id: userId }, profileData, { upsert: true });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all birthday
    async getTodayBirthdays(userId: string): Promise<Record<string, any> | null> {
        try {
            const res = await Birthday.findOne({});

            return res;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all Friends
    async getAllFriends(userId: string): Promise<Record<string, any> | null> {
        try {
            return await Follow.findOne({ userId: userId }, { followers: 1, following: 1 }).populate("followers").populate("following");
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all Friends
    async checkUserFollowing(userId: string, followerId: string): Promise<Record<string, any> | null> {
        try {
            return await Follow.find({ userId: userId, following: { $in: [followerId] } });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all followingData
    async getAllFollowing(userId: string, data: { status: boolean; userId: string | null }): Promise<any> {
        try {
            // If current user

            if (data.status) {
                const res = await Follow.findOne({ userId: userId }).populate("following");
                if (res) {
                    const newArr = res.following.map((obj: any) => {
                        return { ...obj.toObject(), isFollowing: true };
                    });
                    res.following = newArr;
                    return newArr;
                } else {
                    return [];
                }
            }
            // If not current user
            else {
                const res = await Follow.findOne({ userId: data.userId }).populate({
                    path: "following",
                    match: { _id: { $ne: userId } }, // Exclude the current user by matching IDs that are not equal to the current user's ID
                });
                const currentUserFollowing = await Follow.findOne({ userId: userId });
                const userArr = currentUserFollowing?.following || [];
                if (res && res.following) {
                    const newArr = res.following.map((obj: any) => {
                        const isFollowing = userArr.some((id: any) => id.equals(obj._id));
                        return { ...obj.toObject(), isFollowing: isFollowing };
                    });

                    return newArr;
                } else {
                    return [];
                }
            }
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all follower
    async getAllFollower(userId: string, data: { status: boolean; userId: string | null }): Promise<Record<string, any> | null> {
        try {
            if (data.status) {
                const res = await Follow.findOne({ userId: userId }).populate("followers");

                if (res) {
                    const newArr = res.followers.map((obj: any) => {
                        return { ...obj.toObject(), isFollowing: true };
                    });

                    return newArr;
                } else {
                    return [];
                }
            } else {
                const res = await Follow.findOne({ userId: data.userId }).populate({
                    path: "followers",
                    match: { _id: { $ne: userId } }, // Exclude the current user by matching IDs that are not equal to the current user's ID
                });

                const currentUserFollowing = await Follow.findOne({ userId: userId });
                const userArr = currentUserFollowing?.following || [];

                if (res && res.followers) {
                    const newArr = res.followers.map((obj: any) => {
                        const isFollowing = userArr.some((id: any) => id.equals(obj._id));
                        return { ...obj.toObject(), isFollowing: isFollowing };
                    });

                    return newArr;
                } else {
                    return [];
                }
            }
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Show more notification
    async showMoreNotification(userId: string, page: string): Promise<Record<string, any> | null> {
        try {
            const pageNumber = Number(page);
            const notification = await Notification.aggregate([
                {
                    $match: { userId: userId },
                },
                {
                    $unwind: "$notifications",
                },

                {
                    $project: { notifications: 1, _id: 0 },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "notifications.userId",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $sort: { "notifications.createdAt": -1 },
                },
                { $skip: (pageNumber - 1) * 10 },
                { $limit: Number(page) * 10 },
            ]);

            return notification;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Read notification
    async readNotification(userId: string): Promise<Record<string, any> | null> {
        try {
            console.log(userId);
            return await Notification.updateMany({ userId: userId }, { $set: { "notifications.$[].isViewed": true } });
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    // Get notification count
    async getNotificationCount(userId: string): Promise<Record<string, any> | null> {
        try {
            const res = await Notification.aggregate([
                { $match: { userId: userId } },
                { $unwind: "$notifications" },
                { $match: { "notifications.isViewed": false } },
                { $count: "count" },
            ]);

            return res[0] || { count: 0 };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async createTempData(userData: Record<string, any>): Promise<Record<string, any> | null> {
        try {
            const tempUserData = new TempOTP({ userData: userData });
            return await tempUserData.save();
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}

export default UserRepository;
