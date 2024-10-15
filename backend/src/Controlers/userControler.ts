import { NextFunction, Request, Response } from "express";
import UserService from "../Services/userService";
import { STATUS_CODES } from "../Constants/httpStatusCodes";
import { generateAccessToken, verifyRefreshToken } from "../Utils/token";
import { createAdmin } from "../Utils/admin";
import { MESSAGES } from "../Constants/messages";
const { OK, BAD_REQUEST, UNAUTHORIZED, CONFLICT } = STATUS_CODES;

class UserControler {
    constructor(public userServices: UserService) {}

    // @desc   User registation
    // @route  POST /register
    // @access Public
    async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newUser = await this.userServices.createUser(req.body);
            if (!newUser) {
                let user = await this.userServices.registerUser(req.body);
                if (user.success) {
                    req.session.userData = user.user;
                    res.status(OK).json({
                        success: true, 
                        message: "OTP Send for verification..",
                        time: user?.user?.time,
                        otpPlace: user?.user?.email,
                    });
                } else {
                    res.status(BAD_REQUEST).json({ success: false, message: MESSAGES.OTP.VERIFICATION_FAILED });
                }
            } else {
                res.status(BAD_REQUEST).json({ success: false, message: MESSAGES.AUTHENTICATION.DUPLICATE_EMAIL });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   OTP Verification
    // @route  POST /verify-otp
    // @access Public
    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            //taking req.body.otp and session otp
            //validate otp verifying otp valid or not
            const otp = req.body.otp;
            const userData = req.session.userData;
            const isOtpValid = await this.userServices.verifyOtp(otp, userData);
            const accessTokenMaxAge = 5 * 60 * 1000;
            const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
            if (isOtpValid?.success) {
                //Is otp valid create new User and JWT
                const newUser = await this.userServices.saveUser(userData);

                if (newUser?.success) {
                    res.cookie("access_token", newUser.accessToken, { maxAge: accessTokenMaxAge });
                    res.cookie("refresh_token", newUser.refreshToken, { maxAge: refreshTokenMaxAge });
                    res.status(OK).json(newUser);
                } else {
                    res.status(UNAUTHORIZED).json(isOtpValid);
                }
            } else {
                res.status(UNAUTHORIZED).json(isOtpValid);
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   For checking email already exist or not
    // @route  POST /verify-email
    // @access Public
    async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let isEmailExists = await this.userServices.verifyEmail(req.body.email);

            if (isEmailExists) {
                res.status(CONFLICT).json({ success: false, message: "Email already exists" });
            } else {
                res.status(OK).json({ success: true });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   For resending otp
    // @route  POST /resend-otp
    // @access Public
    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let result = await this.userServices.resendOtp(req.session.userData, req.params.id as string);
            if (result?.success) {
                req.session.userData = result.userData;
                res.status(OK).json({
                    success: true,
                    message: "OTP Send for verification..",
                    time: req.session.userData?.time,
                    otpPlace: req.session.userData?.email,
                });
            } else {
                res.status(BAD_REQUEST).json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Logout user
    // @route  Get /logout
    // @access Public
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.cookie("access_token", "", { maxAge: 0 });
            res.cookie("refresh_token", "", { maxAge: 0 });
            res.status(OK).json({ success: true, message: "User logout successfull" });
        } catch (error) {
            next(error);
        }
    }

    // @desc   Login user
    // @route  Post /login
    // @access Public
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const accessTokenMaxAge = 5 * 60 * 1000; // 5 minutes
            const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours
    
            const result = await this.userServices.userLogin(req.body);
    
            if (result?.success) {
                const accessToken = result?.accessToken || ""; // Ensure it's not undefined
                const refreshToken = result?.refreshToken || ""; // Ensure it's not undefined
    
                res.status(200) // Status code 200 for OK
                    .cookie("access_token", accessToken, {
                        maxAge: accessTokenMaxAge,
                        httpOnly: true,
                        secure: true, // Set this to true for HTTPS
                        sameSite: "none", // lowercase "none" for cross-site cookies
                    })
                    .cookie("refresh_token", refreshToken, {
                        maxAge: refreshTokenMaxAge,
                        httpOnly: true,
                        secure: true, // Set this to true for HTTPS
                        sameSite: "none", // lowercase "none"
                    })
                    .json({ success: true, user: result?.user, message: result?.message });
            } else {
                res.status(401).json(result); // Status code 401 for Unauthorized
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   For refreshing accesstoken
    // @route  POST /refresh-token
    // @access Private
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { refresh_token } = req.cookies;

        if (!refresh_token) res.status(UNAUTHORIZED).json({ success: false, message: "No Refresh Token Found" });

        try {
            const decoded: any = verifyRefreshToken(refresh_token);

            const user = await this.userServices.findUserById(decoded.data);

            if (user) {
                const newAccessToken = generateAccessToken(user._id);

                res.json({ access_token: newAccessToken });
            } else {
                res.status(UNAUTHORIZED).json({ success: false, message: "Invalid refresh token" });
            }
        } catch (error) {
            res.status(UNAUTHORIZED).json({ success: false, message: "Invalid refresh token" });
        }
    }

    // @desc   For forgeting password
    // @route  POST /forget-password
    // @access Public
    async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.session.forgetData) res.status(BAD_REQUEST).json({ success: false, message: "No User Found" });
            const result: Record<string, any> = await this.userServices.forgetPassword(req.body.password, req.session.forgetData?.user._id);

            if (result.success) {
                res.status(OK).json(result);
            } else {
                res.status(BAD_REQUEST).json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   For Verify email or phonenumber
    // @route  POST /verify-user
    // @access Public
    async verifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.userServices.verifyUser(req.body);
            if (result.success) {
                req.session.forgetData = result;

                res.status(OK).json({ success: true, time: result.time, userId: result.user._id, message: "Otp send for verification" });
            } else {
                res.status(BAD_REQUEST).json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   For For reseting password of user
    // @route  POST /reset-password
    // @access Private
    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.resetPassword(req.body, req?.userId);

            if (result.success) {
                res.status(OK).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   For For reseting password of user
    // @route  POST /reset-password
    // @access Private
    async submitOtpForgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const time: any = req.session.forgetData?.time;

            const otp = req.body?.otp;
            const timeInSec = Math.floor((Date.now() - time) / 1000);
            if (timeInSec > 30) {
                res.status(BAD_REQUEST).json({ success: false, message: MESSAGES.OTP.EXPIRED });
            }
            if (otp == req?.session?.forgetData?.forgetotp) {
                res.status(OK).json({ success: true, message: MESSAGES.OTP.SUCCESS });
            } else {
                res.status(BAD_REQUEST).json({ success: false, message: MESSAGES.OTP.INVALID });
            }
        } catch (error) {
            next(error);
        }
    }
    // @desc   Google authentication
    // @route  POST /googe/auth
    // @access Public
    async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const accessTokenMaxAge = 5 * 60 * 1000;
            const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
            const result = await this.userServices.googleAuthentication(req.body);

            if (result.success) {
                res.status(OK)
                    .cookie("access_token", result.accessToken, { maxAge: accessTokenMaxAge })
                    .cookie("refresh_token", result.refreshToken, { maxAge: refreshTokenMaxAge })
                    .json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Suggesions
    // @route  POST /suggessions
    // @access Public
    async suggessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.getSuggessions(req.userId);
            if (result) res.status(OK).json({ success: true, users: result });
            else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Follow user
    // @route  GET /follow
    // @access Private
    async followUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.follow(req.query.followerId as string, req.userId);
            if (result) res.status(OK).json({ success: true });
            else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Unfollow user
    // @route  GET /unfollow
    // @access Private
    async unFollowUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.unFollowUser(req.query.followerId as string, req.userId);

            if (result) res.status(OK).json({ success: true });
            else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Unfollow user
    // @route  GET /search
    // @access Private
    async searchUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.searchUser(req.query.query as string, req.userId);

            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else {
                res.status(OK).json({ success: false });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Get profile user
    // @route  GET /profile
    // @access Private
    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.getProfile(req.body.status ? req.userId : req.body.userId);
            if (result) res.status(OK).json(result);
            else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Get Notifications
    // @route  GET /notifications
    // @access Private
    async getNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.getNotification(req.userId as string,req.query.page as string);
            if (result) res.status(OK).json({ success: true, result: result });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc Get all requests
    // @route  GET /requests
    // @access Private
    async getAllRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allRequest = await this.userServices.getAllRequest(req.userId as string);
            if (allRequest) res.status(OK).json({ success: true, result: allRequest });
        } catch (error) {
            next(error);
        }
    }

    // @desc Get all requests
    // @route  GET /follow/accept
    // @access Private
    async acceptFollowRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.acceptFollowRequest(req.userId as string, req.query.followerId as string);
            if (result) res.status(OK).json({ success: true });
            else {
                res.status(BAD_REQUEST).json({ success: false, message: "Something went wrong" });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc Clear All Notification
    // @route  GET /notifications/clear
    // @access Private
    async clearAllNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.clearAllNotifications(req.userId as string);
            if (result) res.status(OK).json({ success: true, message: "Notifications cleared successfully" });
        } catch (error) {
            next(error);
        }
    }

    // @desc Clear All Notification
    // @route  GET /notifications/clear
    // @access Private
    async rejectFollowRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.rejectFollowRequest(req.query.followerId as string, req.userId);
            if (result) res.status(OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    // @desc Clear All Notification
    // @route  GET /profile/image
    // @access Private
    async updateProfilePicture(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.updateProfilePicture(req.files, req.userId);
            if (result) res.status(OK).json(result);
            else res.status(BAD_REQUEST).json({ success: false, message: "Profile picture updation failed" });
        } catch (error) {
            next(error);
        }
    }

    // @desc Update bio
    // @route  GET /profile/bio
    // @access Private
    async updateBio(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.updateBio(req.userId as string, req.body.bio as string);
            if (result) res.status(OK).json({ success: true, bio: req.body.bio });
        } catch (error) {
            next(error);
        }
    }

    // @desc Update Profile
    // @route  PUT /profile
    // @access Private
    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.updateProfile(req.userId, req.body);
            if (result) res.status(OK).json({ success: true, message: "Profile updated successfully" });
            else res.status(BAD_REQUEST).json({ success: false, message: "Profile updation failed" });
        } catch (error) {
            next(error);
        }
    }

    // @desc Update Profile
    // @route  PUT /profile
    // @access Private
    async getBirthdays(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.getBirthdays(req.userId);
            if (result) res.status(OK).json({ success: true, result: result });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc Check user following
    // @route  Get /follow/check
    // @access Private
    async checkUserFollowing(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.checkUserFollowing(req.userId, req.query.followerId as string);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc Remove follower
    // @route  Get /follow/remove
    // @access Private
    async removeFollower(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.removeFollower(req.userId, req.query.followerId as string);
            if (result) {
                res.status(OK).json({ success: true });
            } else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc Get all the following data
    // @route  POST /profile/following
    // @access Private
    async getAllFollowingData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.getAllFollowing(req.userId, req.body);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }
    // @desc Get all the follower data
    // @route  POST /profile/follower
    // @access Private
    async getAllFollowerData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.getAllFollower(req.userId, req.body);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

     // @desc Show more notification
    // @route  GET /notification/more
    // @access Private
    async showMoreNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.showMoreNotification(req.userId, req.query.page as string);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc Make all notifications as read
    // @route  GET /notification/read
    // @access Private
    async readNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.readNotification(req.userId);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc Get notification count
    // @route  GET /notification/count
    // @access Private
    async getNotificationCount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userServices.getNotificationCount(req.userId);
           
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }
}
export default UserControler;
