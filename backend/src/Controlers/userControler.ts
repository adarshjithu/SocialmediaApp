import { NextFunction, Request, Response } from "express";
import UserService from "../Services/userService";
import { STATUS_CODES } from "../Constants/httpStatusCodes";
import { generateAccessToken, verifyRefreshToken } from "../Utils/token";
import { createAdmin } from "../Utils/admin";
import { MESSAGES } from "../Constants/messages";
import TempOTP from "../Models/OTPmodel";
const { OK, BAD_REQUEST, UNAUTHORIZED, CONFLICT } = STATUS_CODES;

class UserControler {
    constructor(public userServices: UserService) {}

    // @desc   User registation
    // @route  POST /register
    // @access Public
    async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        try {
            if(req.body.otpMethod=='email'){
                 const result = await this.userServices.registerWithEmail(req.body);
   
                 if(result?.success){
                    res.status(OK).json(result)
                 }else{
                    res.status(BAD_REQUEST).json(result)
                 }
                 
            }else{
              const result = await this.userServices.registerWithMobile(req.body)
              if(result?.success){
                res.status(OK).json(result)
             }else{
                res.status(BAD_REQUEST).json(result)
             }
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
           
            const isOtpValid = await this.userServices.verifyOtp(req.body);
        
            const accessTokenMaxAge = 5 * 60 * 1000;
            const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
            if (isOtpValid?.success) {
                //Is otp valid create new User and JWT
                const newUser = await this.userServices.saveUser(isOtpValid?.user?.userData);

                if (newUser?.success) {
                    res.cookie("access_token", newUser.accessToken,{
                        maxAge: accessTokenMaxAge,
                        secure: true, 
                        httpOnly:true,
                        sameSite:"none"
                        // Prevent JavaScript access to the cookie
                       
                    });
                    res.cookie("refresh_token", newUser.refreshToken, {
                        maxAge: refreshTokenMaxAge,
                        secure: true, 
                        httpOnly:true,
                        sameSite:"none"
                        // Prevent JavaScript access to the cookie
                       
                    });
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
          
            const result = await this.userServices.resendOtp(req.body);
            if(result?.success){
                res.status(OK).json(result)
            }else{
                res.status(BAD_REQUEST).json(result)
            }
           
            
        } catch (error) { 
            next(error);
        }
    }

  // @desc   Logout user
// @route  GET /logout
// @access Public
async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Clearing the access token cookie
        res.cookie("access_token", "", {
            maxAge: 0, // Expire immediately
            httpOnly: true, // Same as set
            secure: true,  // Same as set, especially for production (HTTPS)
            sameSite: 'none'  // Same as set
        });

        // Clearing the refresh token cookie
        res.cookie("refresh_token", "", {
            maxAge: 0, // Expire immediately
            httpOnly: true, // Same as set
            secure: true,  // Same as set
            sameSite: 'none'  // Same as set
        });

        // Responding with a success message
        res.status(200).json({ success: true, message: "User logout successful" });
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
                // Ensure the tokens are defined as strings
                const accessToken: string = result?.accessToken || ""; 
                const refreshToken: string = result?.refreshToken || ""; 
    
                res.status(200) // Status code 200 for OK
                    .cookie("access_token", accessToken, {
                        maxAge: accessTokenMaxAge,
                        secure: true, 
                        httpOnly:true,
                        sameSite:"none"
                        // Prevent JavaScript access to the cookie
                       
                    })
                    .cookie("refresh_token", refreshToken, {
                        maxAge: refreshTokenMaxAge, 
                        secure: true, 
                        httpOnly:true,
                        sameSite:'none'// Always use secure cookies
                        // Prevent JavaScript access to the cookie
                       
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
    
        // Check if the refresh token is present
        if (!refresh_token) {
             res.status(401).json({ success: false, message: "No Refresh Token Found" });
        }
    
        try {
            // Verify the refresh token
            const decoded: any = verifyRefreshToken(refresh_token);
    
            // Check if the user associated with the refresh token exists
            const user = await this.userServices.findUserById(decoded.data);
            
            if (!user) {
                 res.status(401).json({ success: false, message: "Invalid refresh token" });
            }
    
            // Generate a new access token
            const newAccessToken = generateAccessToken(user?._id);
    
            // Set the new access token in a cookie (if needed)
            res.cookie("access_token", newAccessToken, {
                maxAge: 5 * 60 * 1000, // 5 minutes
                httpOnly: true,
                secure: true, 
                sameSite: 'none', 
            });
    
            // Respond with the new access token (if you need it in the response body)
            res.json({ success: true, access_token: newAccessToken });
        } catch (error) {
            // Handle errors such as token verification failure
            console.error("Error refreshing token:", error);
            res.status(401).json({ success: false, message: "Invalid refresh token" });
        }
    }
    

    // @desc   For forgeting password
    // @route  POST /forget-password
    // @access Public
    async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
           const result  = await this.userServices.forgetPassword(req.body)
           if(result?.success){
            res.status(OK).json(result)
           }else{
            res.status(BAD_REQUEST).json(result)
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
            if(result?.success){
                res.status(OK).json(result)
            }else{
                res.status(BAD_REQUEST).json(result)
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
          
          const details = await TempOTP.findOne({_id:req.body.id});
          const curTime: number = Date.now();
          const otpTime: any = details?.userData?.time;
          let timeInSec = Math.floor((curTime - otpTime) / 1000);
          if(timeInSec<30){

            if(details?.userData?.otp==req.body.otp){
                res.status(OK).json({success:true,message:'OTP Verified successfully'})
            }else{
                res.status(BAD_REQUEST).json({success:false,message:'The OTP you entered is incorrect. Please try again.'})
            }
          }else{
            res.status(BAD_REQUEST).json({success:false,message:"OTP Expired"})
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
                    .cookie("access_token", result.accessToken, {
                        maxAge: accessTokenMaxAge, // 5 minutes
                        httpOnly: true,
                        secure: true, 
                        sameSite: 'none', 
                    })
                    .cookie("refresh_token", result.refreshToken, {
                        maxAge: refreshTokenMaxAge, // 5 minutes
                        httpOnly: true,
                        secure: true, 
                        sameSite: 'none', 
                    })
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
            const result = await this.userServices.getNotification(req.userId as string, req.query.page as string);
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

    // @desc   Resend forget password otp
    // @route  POST /password/forget/resend
    // @access Private
    async resendForgetOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const result  = await this.userServices.resendForgetOtp(req.body);
          if(result?.success){
            res.status(OK).json(result)
          }else{
            res.status(BAD_REQUEST).json(result)
          }

        } catch (error) {
            next(error);
        }
    }
}
export default UserControler;
