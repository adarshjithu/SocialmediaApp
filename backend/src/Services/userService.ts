import { IEditProfile, ResetPasswordInterface } from "../Inteface/userInterfaces";
import { IUser, User } from "../Models/userModel";
import UserRepository from "../Repositories/user/userRepository";
import { generateOtp, sendOtp } from "../Utils/otp";
import { comparePassword, hashPassword } from "../Utils/password";
import { generateAccessToken, generateRefreshToken, validateInput } from "../Utils/token";

import { MESSAGES } from "../Constants/messages";
import { IUserServices } from "./interface/IUserServices";

import { uploadImageToCloudinary } from "../Utils/upload";
import { IRegister, IResponse } from "../Inteface/IUser";
export type UserReponse = IUser | null;
export type UserResponeType = IUser | null | { success?: boolean };

class UserService implements IUserServices {
    constructor(public userRepository: UserRepository) {}

    // Checking email exists or not
    async createUser(userData: IUser): Promise<UserReponse> {
        try {
            return this.userRepository.emailExist(userData.email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Verify OTP in signup
    async verifyOtp(otp: number, userData: any): Promise<IResponse> {
        try {
            const curTime: number = Date.now();
            const otpTime: any = userData?.time;
            let timeInSec = Math.floor((curTime - otpTime) / 1000);

            if (!userData) {
                return { success: false, message: MESSAGES.AUTHENTICATION.INVALID_USER };
            }
            if (!otp) {
                return { success: false, message: MESSAGES.OTP.INVALID };
            }

            if (timeInSec > 30) {
                return { success: false, message: MESSAGES.OTP.EXPIRED };
            } else {
                if (otp == userData.otp) {
                    return { success: true, message: MESSAGES.OTP.SUCCESS };
                } else {
                    return { success: false, message: MESSAGES.OTP.INVALID };
                }
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.OTP.FAILED };
        }
    }

    // Save all the user after OTP verification in the database
    async saveUser(userData: any): Promise<IRegister> {
        try {
            userData.password = await hashPassword(userData.password);
            const user = await this.userRepository.saveUser(userData);

            if (user) {
                const userId = String(user?._id);

                const accessToken = generateAccessToken(userId);
                const refreshToken = generateRefreshToken(userId);

                return {
                    success: true,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: user,
                    message: MESSAGES.AUTHENTICATION.SUCCESS,
                };
            } else {
                return {
                    success: false,
                    message: MESSAGES.AUTHENTICATION.FAIL,
                };
            }
        } catch (error) {
            console.log(error as Error);

            return { success: false };
        }
    }

    // For Verifying email
    async verifyEmail(email: string): Promise<IUser | null> {
        try {
            return await this.userRepository.checkEmail(email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // For resending otp in the signup processs
    async resendOtp(userData: any, id: string): Promise<IResponse> {
        try {
            if (!userData) {
                
                return { success: false, message: MESSAGES.AUTHENTICATION.INVALID_USER };
            } else {
                const otp = generateOtp();
                if (await sendOtp(userData, otp)) {
                    const time = Date.now();
                    userData.time = time;
                    userData.otp = otp;
                    return { success: true, userData: userData };
                } else {
                    return { success: false, message: MESSAGES.OTP.FAILED };
                }
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.OTP.FAILED };
        }
    }

    // Registering user while signup with otp
    async registerUser(userData: IUser): Promise<Partial<IResponse>> {
        try {
            const otp = generateOtp();

            if (await sendOtp(userData, otp)) {
                const time = Date.now();
                const user = {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    phonenumber: userData.phonenumber,
                    otp: otp,
                    time: time,
                };
                return { success: true, user: user };
            } else {
                return { success: false };
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false };
        }
    }

    // For login user
    async userLogin(userData: any): Promise<IRegister> {
        try {
            const user = await this.userRepository.checkEmail(userData.email);

            if (!user) {
                return { success: false, message: MESSAGES.AUTHENTICATION.INVALID_USER };
            } else {
                if (user.isBlocked) {
                    return { success: false, message: MESSAGES.AUTHENTICATION.BLOCK_USER };
                }
                const isPasswordValid = await comparePassword(userData.password, user.password);
                if (isPasswordValid) {
                    const accessToken = generateAccessToken(String(user?._id));
                    const refreshToken = generateRefreshToken(String(user?._id));

                    return {
                        success: true,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            phonenumber: user.phonenumber,
                            isBlocked: user.isBlocked,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            username: user?.username || "",
                            bio: user?.bio || "",
                            dateofbirth: user?.dateofbirth || "",
                            image: user?.image || "",
                        },
                        message: MESSAGES.AUTHENTICATION.SUCCESS,
                    };
                } else {
                    return {
                        success: false,
                        message: MESSAGES.AUTHENTICATION.INVALID_PASSWORD,
                    };
                }
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.AUTHENTICATION.FAIL };
        }
    }

    // Find user byid
    async findUserById(id: string): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.findById(id);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async verifyUser(arg: any): Promise<Record<string, any>> {
        try {
            let emailOrPhone = validateInput(arg.type);
            if (emailOrPhone.email || emailOrPhone.phonenumber) {
                emailOrPhone.isForForget = true;
                const user = await this.userRepository.findByEmailOrPhone(emailOrPhone);

                if (user) {
                    const otp = generateOtp();
                    if (await sendOtp(emailOrPhone, otp)) {
                        return { success: true, time: Date.now(), forgetotp: otp, user: user, message: "Otp Send for verification" };
                    } else {
                        return { success: false, message: MESSAGES.OTP.VERIFICATION_FAILED };
                    }
                } else {
                    return { success: false, message: MESSAGES.AUTHENTICATION.INVALID_USER };
                }
            } else {
                return { success: false, message: MESSAGES.AUTHENTICATION.INVALID_CREDENTIIALS };
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false };
        }
    }

    // Reset password
    async resetPassword(userData: ResetPasswordInterface, userId: string): Promise<IResponse> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }
            if (userData.oldpassword == userData.newpassword) {
                return { success: false, message: MESSAGES.AUTHENTICATION.REFUSED_PASSWORD };
            }
            const isPasswordValid = await comparePassword(userData.oldpassword, user.password);
            if (isPasswordValid) {
                const newPassword = await hashPassword(userData.newpassword);
                let result = await this.userRepository.updatePassword(newPassword, userId);
                if (result) {
                    return { success: true, message: MESSAGES.AUTHENTICATION.PASSWORD_SUCCESS };
                } else {
                    return { success: false, message: MESSAGES.AUTHENTICATION.PASSWORD_FAIL };
                }
            } else {
                return {
                    success: false,
                    message: MESSAGES.AUTHENTICATION.INVALID_PASSWORD,
                };
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.AUTHENTICATION.PASSWORD_FAIL };
        }
    }

    // Forget password
    async forgetPassword(pass: string, userId: string): Promise<IResponse> {
        try {
            const user = (await this.findUserById(userId)) as IUser;

            const isSamePass = await comparePassword(pass, user.password);
            if (isSamePass) {
                return {
                    success: false,
                    message: MESSAGES.AUTHENTICATION.REFUSED_PASSWORD,
                };
            }

            const hashPass = await hashPassword(pass);
            this.userRepository.updatePassword(hashPass, userId);
            return {
                success: true,
                message: MESSAGES.AUTHENTICATION.PASSWORD_SUCCESS,
            };
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.AUTHENTICATION.FAIL };
        }
    }

    // Google Authentication
    async googleAuthentication(userData: IUser): Promise<IRegister> {
        try {
            const isEmailExists = await this.userRepository.emailExist(userData.email);
            if (isEmailExists) {
                const accessToken = generateAccessToken(isEmailExists._id);
                const refreshToken = generateRefreshToken(isEmailExists._id);
                return {
                    success: true,
                    message: MESSAGES.AUTHENTICATION.SUCCESS,
                    user: isEmailExists,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            } else {
                const password = String(Math.floor(Math.random() * 1000000));
                userData.password = await hashPassword(`${password}`);
                const res = await this.userRepository.createUser(userData);
                if (res) {
                    const accessToken = generateAccessToken(res._id);
                    const refreshToken = generateRefreshToken(res._id);
                    return {
                        success: true,
                        message: MESSAGES.AUTHENTICATION.SUCCESS,
                        user: res,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    };
                } else {
                    return { success: false, message: MESSAGES.AUTHENTICATION.FAIL };
                }
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.AUTHENTICATION.FAIL };
        }
    }

    // Forget password
    async getSuggessions(userId: string): Promise<IUser[] | null> {
        try {
            return await this.userRepository.getSuggessions(userId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Follow user
    async follow(followerId: string, userId: string): Promise<Record<string, any> | null | undefined> {
        try {
            //Checking the user is private or not
            const user = await this.userRepository.findById(userId);
            if (!user?.isPrivate) {
                await this.userRepository.addFollowers(followerId, userId);
            }

            //Sending notifications

            if (String(followerId) !== String(userId)) {
                await this.userRepository.addNotification(followerId, {
                    userId: userId,
                    message: "follow",
                    image: "",
                    data: "",
                    createdAt: new Date(),
                });
            }

            await this.userRepository.addFollowing(followerId, userId);
            await this.userRepository.addRequest(followerId, userId);
            return { success: true };
        } catch (error) {
            {
                success: false;
            }
            console.log(error as Error);
        }
    }
    // Unfollow user
    async unFollowUser(followerId: string, userId: string): Promise<Record<string, any> | null | undefined> {
        try {
            const result = await this.userRepository.unFollow(followerId, userId);
            await this.userRepository.removeRequest(followerId, userId);
            return result;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Search User
    async searchUser(query: string, userId: string): Promise<Record<string, any> | null> {
        try {
            const result = await this.userRepository.searchUser(query, userId);
            return result;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Search User
    async getProfile(userId: string): Promise<Record<string, any> | null> {
        try {
            const result = await this.userRepository.getProfile(userId);
            return result;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all notification
    async getNotification(userId: string,page:string): Promise<Record<string, any> | null> {
        try {
            return this.userRepository.getNotification(userId,page);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all notification
    async getAllRequest(userId: string): Promise<Record<string, any> | null> {
        try {
            return this.userRepository.getAllRequest(userId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all notification
    async acceptFollowRequest(userId: string, followerId: string): Promise<Record<string, any> | null> {
        try {
            await this.userRepository.removeRequest(userId, followerId);
            await this.userRepository.addFollowing(followerId, userId);
            await this.userRepository.addFollowers(followerId, userId);
            const user = await this.userRepository.findById(userId);
            // if (!user?.isPrivate) {
            //     await this.userRepository.addFollowers(followerId, userId);
            // }

            //Sending notifications

            if (String(followerId) !== String(userId)) {
                await this.userRepository.addNotification(followerId, {
                    userId: userId,
                    message: "follow accept",
                    image: "",
                    data: "",
                    createdAt: new Date(),
                });
            }

            return { success: true };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Clear all the notifications for a user
    async clearAllNotifications(userId: string): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.clearAllNotifications(userId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Reject follow request
    async rejectFollowRequest(followerId: string, userId: string): Promise<Record<string, any> | null> {
        try {
            await this.userRepository.removeRequest(userId, followerId);
            await this.userRepository.removeFollower(userId, followerId);
            return await this.userRepository.removeFollowing(userId, followerId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Update profile picture
    async updateProfilePicture<T>(files: T, userId: string): Promise<Record<string, any> | null> {
        try {
            const result = await uploadImageToCloudinary(files);
            if (!result.success) return { success: false, message: "Profile picture updation failed" };
            const images = result?.results?.map((obj: any) => obj?.url);
            if (images) {
                const res = await this.userRepository.updateProfilePicture(userId, images[0]);
                if (res) return { success: true, image: images[0] };
                else {
                    return { success: false, message: "Profile picture updation Failed" };
                }
            } else {
                if (!result.success) return { success: false, message: "Profile picture updation failed" };
            }
            return null;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Update bio
    async updateBio(userId: string, bio: string): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.updateBio(userId, bio);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Update bio
    async updateProfile(userId: string, profileData: IEditProfile): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.updateProfile(userId, profileData);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // getBirthday
    async getBirthdays(userId: string): Promise<Record<string, any> | null> {
        try {
            const birthdays = await this.userRepository.getTodayBirthdays(userId);
          
            const allFriends = await this.userRepository.getAllFriends(userId);
            const allBirthdayUsers: any = [];
            birthdays?.birthdays.map((obj: any) => {
                allFriends?.followers.forEach((i: any) => {
                    if (String(obj) == String(i._id)) allBirthdayUsers.push(JSON.stringify(i));
                });
                allFriends?.following.forEach((i: any) => {
                    if (String(obj) == String(i._id)) allBirthdayUsers.push(JSON.stringify(i));
                });
            });
            const result = [...new Set(allBirthdayUsers)];
      
            return result;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // CheckUserFollowing
    async checkUserFollowing(userId: string, followerId: string): Promise<Record<string, any> | null> {
        try {
            const res = await this.userRepository.checkUserFollowing(userId, followerId);
            if (res?.length == 0) return { success: false };
            else return { success: true };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Remove follower
    async removeFollower(userId: string, followerId: string): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.removeFollower(userId, followerId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }


    
    // Get all the following data
    async getAllFollowing(userId: string, data: {status:boolean,userId:string|null}): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.getAllFollowing(userId, data);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

     // Get all the follower data
     async getAllFollower(userId: string, data: {status:boolean,userId:string|null}): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.getAllFollower(userId, data);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

     // Get more notification
     async showMoreNotification(userId: string,page:string): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.showMoreNotification(userId, page);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
     // Read notification
     async readNotification(userId: string): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.readNotification(userId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Get notification count
    async getNotificationCount(userId: string): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.getNotificationCount(userId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    
}
export default UserService;
