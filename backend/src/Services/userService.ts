import { IEditProfile, ResetPasswordInterface } from "../Inteface/userInterfaces";
import { IUser, User } from "../Models/userModel";
import UserRepository from "../Repositories/user/userRepository";
import { generateOtp, sendOtp } from "../Utils/otp";
import { comparePassword, hashPassword } from "../Utils/password";
import { generateAccessToken, generateRefreshToken, validateInput } from "../Utils/token";
import { sentOtpToEmail } from "../Utils/sendOtpToEmail";
import { MESSAGES } from "../Constants/messages";
import { IUserServices } from "./interface/IUserServices";

import { uploadImageToCloudinary } from "../Utils/upload";
import { IRegister, IResponse } from "../Inteface/IUser";
import TempOTP from "../Models/OTPmodel";
import { sendOtpToPhone } from "../Utils/sendOtoToMobile";
export type UserReponse = IUser | null;
export type UserResponeType = IUser | null | { success?: boolean };

class UserService implements IUserServices {
    constructor(public userRepository: UserRepository) {}

    // Register with email
    async registerWithEmail(userData: IUser): Promise<Record<string, any>> {
        try {
            const newUser = await this.userRepository.emailExist(userData.email);
            if (!newUser) {
                const otp = generateOtp();
                const isOtpSend = await sentOtpToEmail(userData.email, otp);
                if (isOtpSend) {
                    userData.time = Date.now();
                    userData.otp = otp;
                    const saveTempData = await this.userRepository.createTempData(userData);
                    const userObj = {
                        _id: saveTempData?._id,
                        time: saveTempData?.userData?.time,
                        otpMethod: saveTempData?.userData.otpMethod,
                        email: saveTempData?.userData?.email,
                        phonenumber: saveTempData?.userData?.phonenumber,
                    };

                    if (saveTempData) {
                        return {
                            success: true,
                            user: userObj,
                            message:
                                "Your OTP has been successfully sent to your email address. Please check your inbox and enter the OTP to continue.",
                        };
                    } else {
                        return { success: false, message: MESSAGES.OTP.FAILED };
                    }
                } else {
                    return { success: false, message: MESSAGES.OTP.FAILED };
                }
            } else {
                return { success: false, message: MESSAGES.AUTHENTICATION.DUPLICATE_EMAIL };
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.OTP.FAILED };
        }
    }

    // Register with phonenumber
    async registerWithMobile(userData: IUser): Promise<IResponse | null> {
        try {
            const newUser = await this.userRepository.emailExist(userData.email);
            if (!newUser) {
                const otp = generateOtp();
                const isOtpSend = await sendOtpToPhone(userData.phonenumber, otp);

                if (isOtpSend) {
                    userData.time = Date.now();
                    const saveTempData = await this.userRepository.createTempData(userData);
                    if (saveTempData) {
                        return { success: true, user: saveTempData, message: "OTP send to your email " };
                    } else {
                        return { success: false, message: MESSAGES.OTP.FAILED };
                    }
                } else {
                    return { success: false, message: "Something went wrong please try sending to email" };
                }
            } else {
                return { success: false, message: MESSAGES.AUTHENTICATION.DUPLICATE_EMAIL };
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.OTP.FAILED };
        }
    }

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
    async verifyOtp(userData: any): Promise<Record<string, any> | null> {
        try {
            const user = await TempOTP.findOne({ _id: userData._id });

            const curTime: number = Date.now();
            const otpTime: any = user?.userData?.time;
            let timeInSec = Math.floor((curTime - otpTime) / 1000);
            if (timeInSec > 30) {
                return { success: false, message: "The OTP has expired. Please request a new OTP to proceed." };
            } else {
                if (userData?.otp == user?.userData?.otp) {
                    return { success: true, user: user, message: "OTP verification successfull " };
                } else {
                    return { success: false, message: "The OTP you entered is incorrect. Please try again." };
                }
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false, message: MESSAGES.OTP.FAILED };
        }
    }

    // Save all the user after OTP verification in the database
    async saveUser(userData: any): Promise<Record<string, any> | null | undefined> {
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
    async resendOtp(userData: Record<string, any>): Promise<IResponse | null> {
        try {
            const otp = generateOtp();
            if (userData.otpMethod == "email") {
                const otpSend = await sentOtpToEmail(userData.email, otp);
                if (otpSend) {
                    const time = Date.now();
                    const res = await TempOTP.updateOne({ _id: userData._id }, { $set: { "userData.time": time, "userData.otp": otp } });
                    if (res) {
                        return {
                            success: true,
                            user: { ...userData, time: time, otp: otp },
                            message: "Your OTP has been successfully sent to your email",
                        };
                    } else {
                        return { success: false, message: "Something went wrong" };
                    }
                } else {
                    return { success: false, message: "Something went wrong please try again" };
                }
            } else {
                const otpSend = await sendOtpToPhone(userData.phonenumber, otp);
                if (otpSend) {
                    const time = Date.now();
                    const res = await TempOTP.updateOne({ _id: userData._id }, { $set: { time: time } });
                    if (res) {
                        return {
                            success: true,
                            user: { ...userData, time: time, otp: otp },
                            message: "Your OTP has been successfully sent to your email",
                        };
                    } else {
                        return { success: false, message: "Something went wrong" };
                    }
                } else {
                    return { success: false, message: "Something went wrong please try again" };
                }
            }
            return null;
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
    async verifyUser(arg: any): Promise<Record<string, any> | null | undefined> {
        try {
            const isValid = validateInput(arg.type);
            if (isValid.type == "email") {
                const user = await User.findOne({ email: arg.type });
                if (!user) {
                    return { success: false, message: "User not found with this email" };
                } else {
                    const otp = generateOtp();
                    const isOtpSend = await sentOtpToEmail(arg.type, otp);
                    if (isOtpSend) {
                        const tempData = new TempOTP({ userData: { time: Date.now(), otpMethod: "email", email: arg.type, otp: otp } });
                        await tempData.save();

                        return {
                            success: true,
                            time: tempData.userData.time,
                            id: tempData._id,
                            otpMethod: "email",
                            message: "OTP has been successfully send to you email",
                            email: arg?.type,
                        };
                    } else {
                        return { success: false, message: "Failed to send otp to the email " };
                    }
                }
            } else if (isValid.type == "phonenumber") {
                const user = await User.findOne({ phonenumber: arg.type });
                if (!user) {
                    return { success: false, message: "User not found with this Phonenumber" };
                } else {
                    const otp = generateOtp();
                    const isOtpSend = await sendOtpToPhone(arg.type, otp);
                    if (isOtpSend) {
                        const tempData = new TempOTP({ userData: { time: Date.now(), otpMethod: "phonenumber", phonenumber: arg.type, otp: otp } });
                        await tempData.save();

                        return {
                            success: true,
                            time: tempData.userData.time,
                            id: tempData._id,
                            otpMethod: "phonenumber",
                            message: "OTP has been successfully send to you phonenumber",
                        };
                    } else {
                        return { success: false, message: "Failed to send OTP to the mobile number please try email " };
                    }
                }
            } else {
                return { success: false, message: "Invalid input: Enter a valid email or 10-digit phone number" };
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
    async forgetPassword(userData: Record<string, any>): Promise<Record<string, any> | null | undefined> {
        try {
            const details = await TempOTP.findOne({ _id: userData?.id });
            const user = await User.findOne({ $or: [{ email: details?.userData?.email }, { phonenumber: details?.userData?.phonenumber }] });
            const isSamePass = await comparePassword(userData?.password, user?.password as string);
            if (isSamePass) {
                return {
                    success: false,
                    message: MESSAGES.AUTHENTICATION.REFUSED_PASSWORD,
                };
            }
            const hashPass = await hashPassword(userData?.password);
            await User.updateOne({ _id: user?._id }, { $set: { password: hashPass } });

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
    async getNotification(userId: string, page: string): Promise<Record<string, any> | null> {
        try {
            return this.userRepository.getNotification(userId, page);
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
    async getAllFollowing(userId: string, data: { status: boolean; userId: string | null }): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.getAllFollowing(userId, data);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get all the follower data
    async getAllFollower(userId: string, data: { status: boolean; userId: string | null }): Promise<Record<string, any> | null> {
        try {
            return await this.userRepository.getAllFollower(userId, data);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get more notification
    async showMoreNotification(userId: string, page: string): Promise<Record<string, any> | null> {
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

    // Resend otp for forget password
    async resendForgetOtp(userData: Record<string, any>): Promise<Record<string, any> | null> {
        try {
            console.log(userData);
            const otp = generateOtp();
            const userId = userData?.id;
            if (userData?.otpMethod == "email") {
                const details = await TempOTP.findOne({ _id: userId });
                const isOtpSend = await sentOtpToEmail(details?.userData?.email, otp);
                if (isOtpSend) {
                    const time = Date.now();
                    await TempOTP.updateOne({ _id: userId }, { $set: { "userData.time": time, "userData.otp": otp } });
                    return { ...userData, time: time };
                } else {
                    return { success: false, message: "Failed to send otp to you email" };
                }
            } else {
            }
            return null;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}
export default UserService;
