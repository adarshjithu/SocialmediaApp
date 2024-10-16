"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../../Models/userModel");
const FollowModel_1 = __importDefault(require("../../Models/FollowModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const postModels_1 = require("../../Models/postModels");
const notificationModel_1 = __importDefault(require("../../Models/notificationModel"));
const birthdayModel_1 = __importDefault(require("../../Models/birthdayModel"));
const OTPmodel_1 = __importDefault(require("../../Models/OTPmodel"));
class UserRepository {
    // For checking user exist or not
    emailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield userModel_1.User.findOne({ email: email });
                return userFound;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // To Insert Userdata inside database
    saveUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userObj = { name: data.name, email: data.email, phonenumber: data.phonenumber, password: data.password };
                const newUser = new userModel_1.User(userObj);
                yield newUser.save();
                return { name: newUser.name, email: newUser.email, phonenumber: newUser.phonenumber, _id: newUser._id };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // To check existing user with email
    checkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.User.findOne({ email: email });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Getting user data with _id
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.User.findById(id);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all the user data with email or phonenumber
    findByEmailOrPhone(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.phonenumber) {
                    return yield userModel_1.User.findOne({ phonenumber: data.phonenumber });
                }
                else {
                    return yield userModel_1.User.findOne({ email: data.email });
                }
            }
            catch (error) {
                return null;
            }
        });
    }
    // Update password of user with userid
    updatePassword(newPassword, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.User.updateOne({ _id: userId }, {
                    $set: { password: newPassword },
                });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Create user
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.User.updateOne({ email: userData.email }, { $set: userData }, { upsert: true, new: true });
                return yield userModel_1.User.findOne({ email: userData.email });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get suggessions
    getSuggessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If following is empty we can provide all users
                const followData = yield FollowModel_1.default.findOne({ userId: userId });
                if ((followData === null || followData === void 0 ? void 0 : followData.following.length) == 0 || !followData) {
                    return yield userModel_1.User.find({}).limit(3);
                }
                const following = followData.following || [];
                const users = yield userModel_1.User.aggregate([
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
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    unFollow(followerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("unfollow");
                const fId = new mongoose_1.default.Types.ObjectId(followerId);
                const uId = new mongoose_1.default.Types.ObjectId(userId);
                yield FollowModel_1.default.updateOne({ userId: fId }, { $pull: { requests: uId } });
                yield FollowModel_1.default.updateOne({ userId: fId }, { $pull: { followers: uId } });
                yield FollowModel_1.default.updateOne({ userId: uId }, { $pull: { following: fId } });
                return { success: true };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Search User
    searchUser(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.User.aggregate([
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
                                                { $eq: ["$userId", new mongoose_1.default.Types.ObjectId(userId)] }, // Current user
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
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Get Profile
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (yield userModel_1.User.findOne({ _id: userId }).lean());
                user.password = "";
                const post = yield postModels_1.Post.find({ user: userId }).sort({ _id: -1 });
                return { user: user, posts: post };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Add Followers
    addFollowers(followerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fId = new mongoose_1.default.Types.ObjectId(followerId);
                const uId = new mongoose_1.default.Types.ObjectId(userId);
                return yield FollowModel_1.default.updateOne({ userId: followerId }, { $addToSet: { followers: uId } }, { upsert: true });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Add Followers
    addFollowing(followerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fId = new mongoose_1.default.Types.ObjectId(followerId);
                const uId = new mongoose_1.default.Types.ObjectId(userId);
                return yield FollowModel_1.default.updateOne({ userId: userId }, { $addToSet: { following: fId } }, { upsert: true });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Add Request
    addRequest(followerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fId = new mongoose_1.default.Types.ObjectId(followerId);
                const uId = new mongoose_1.default.Types.ObjectId(userId);
                return yield FollowModel_1.default.updateOne({ userId: followerId }, { $addToSet: { requests: { userId: uId } } }, { upsert: true });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Add notification
    addNotification(userId, notificationObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return notificationModel_1.default.updateOne({ userId: userId }, { $addToSet: { notifications: notificationObj } }, { upsert: true });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Get Notifications
    getNotification(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield notificationModel_1.default.aggregate([
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
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Get Notifications
    getAllRequest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield FollowModel_1.default.findOne({ userId: userId }).populate("requests.userId");
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Remove the request from userRequest array
    removeRequest(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield FollowModel_1.default.updateOne({ userId: userId }, { $pull: { requests: { userId: followerId } } });
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Clear all the notifications of a user
    clearAllNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield notificationModel_1.default.updateOne({ userId: userId }, { $set: { notifications: [] } });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Remove followers
    removeFollower(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield FollowModel_1.default.updateOne({ userId: userId }, { $pull: { followers: followerId } });
                return yield FollowModel_1.default.updateOne({ userId: followerId }, { $pull: { following: userId } });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Remove following
    removeFollowing(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield FollowModel_1.default.updateOne({ userId: followerId }, { $pull: { following: userId } });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Find follow by id
    findFollowById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield FollowModel_1.default.findOne({ userId: userId });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Find follow by id
    updateProfilePicture(userId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.User.updateOne({ _id: userId }, { $set: { image: image } });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Update Bio
    updateBio(userId, bio) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.User.updateOne({ _id: userId }, { $set: { bio: bio } });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Update Profile
    updateProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.User.findByIdAndUpdate({ _id: userId }, profileData, { upsert: true });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all birthday
    getTodayBirthdays(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield birthdayModel_1.default.findOne({});
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all Friends
    getAllFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield FollowModel_1.default.findOne({ userId: userId }, { followers: 1, following: 1 }).populate("followers").populate("following");
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all Friends
    checkUserFollowing(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield FollowModel_1.default.find({ userId: userId, following: { $in: [followerId] } });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all followingData
    getAllFollowing(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If current user
                if (data.status) {
                    const res = yield FollowModel_1.default.findOne({ userId: userId }).populate("following");
                    if (res) {
                        const newArr = res.following.map((obj) => {
                            return Object.assign(Object.assign({}, obj.toObject()), { isFollowing: true });
                        });
                        res.following = newArr;
                        return newArr;
                    }
                    else {
                        return [];
                    }
                }
                // If not current user
                else {
                    const res = yield FollowModel_1.default.findOne({ userId: data.userId }).populate({
                        path: "following",
                        match: { _id: { $ne: userId } }, // Exclude the current user by matching IDs that are not equal to the current user's ID
                    });
                    const currentUserFollowing = yield FollowModel_1.default.findOne({ userId: userId });
                    const userArr = (currentUserFollowing === null || currentUserFollowing === void 0 ? void 0 : currentUserFollowing.following) || [];
                    if (res && res.following) {
                        const newArr = res.following.map((obj) => {
                            const isFollowing = userArr.some((id) => id.equals(obj._id));
                            return Object.assign(Object.assign({}, obj.toObject()), { isFollowing: isFollowing });
                        });
                        return newArr;
                    }
                    else {
                        return [];
                    }
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all follower
    getAllFollower(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.status) {
                    const res = yield FollowModel_1.default.findOne({ userId: userId }).populate("followers");
                    if (res) {
                        const newArr = res.followers.map((obj) => {
                            return Object.assign(Object.assign({}, obj.toObject()), { isFollowing: true });
                        });
                        return newArr;
                    }
                    else {
                        return [];
                    }
                }
                else {
                    const res = yield FollowModel_1.default.findOne({ userId: data.userId }).populate({
                        path: "followers",
                        match: { _id: { $ne: userId } }, // Exclude the current user by matching IDs that are not equal to the current user's ID
                    });
                    const currentUserFollowing = yield FollowModel_1.default.findOne({ userId: userId });
                    const userArr = (currentUserFollowing === null || currentUserFollowing === void 0 ? void 0 : currentUserFollowing.following) || [];
                    if (res && res.followers) {
                        const newArr = res.followers.map((obj) => {
                            const isFollowing = userArr.some((id) => id.equals(obj._id));
                            return Object.assign(Object.assign({}, obj.toObject()), { isFollowing: isFollowing });
                        });
                        return newArr;
                    }
                    else {
                        return [];
                    }
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Show more notification
    showMoreNotification(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = Number(page);
                const notification = yield notificationModel_1.default.aggregate([
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
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Read notification
    readNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId);
                return yield notificationModel_1.default.updateMany({ userId: userId }, { $set: { "notifications.$[].isViewed": true } });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get notification count
    getNotificationCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield notificationModel_1.default.aggregate([
                    { $match: { userId: userId } },
                    { $unwind: "$notifications" },
                    { $match: { "notifications.isViewed": false } },
                    { $count: "count" },
                ]);
                return res[0] || { count: 0 };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    createTempData(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tempUserData = new OTPmodel_1.default({ userData: userData });
                return yield tempUserData.save();
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = UserRepository;
