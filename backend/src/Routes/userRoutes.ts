import express, { Request, response, Router } from "express";
import UserRepository from "../Repositories/user/userRepository";
import UserService from "../Services/userService";
import UserControler from "../Controlers/userControler";
import { authenticate } from "../Middleware/userAuth";
import upload from '../Middleware/upload';
const userRouter: Router = express.Router();

// userRouter.get("/register", (req, res) => {});

const userRepository = new UserRepository();
const userServices = new UserService(userRepository);
const controler = new UserControler(userServices);


// Authentication
userRouter.post("/register", (req, res, next) => {  controler.registerUser(req, res, next);});
userRouter.post('/verify-email',(req,res,next) => controler.verifyEmail(req,res,next))
userRouter.get("/logout",(req,res,next) => controler.logout(req,res,next));//
userRouter.post("/login",(req,res,next) => controler.login(req,res,next));
userRouter.post("/refresh-token",(req,res,next) => controler.refreshToken(req,res,next));
userRouter.post("/password/forget",(req,res,next) => controler.forgetPassword(req,res,next));
userRouter.post('/password/forget/resend',(req,res,next)=>controler.resendForgetOtp(req,res,next))
userRouter.post("/verify-user",(req,res,next) => controler.verifyUser(req,res,next));
userRouter.post("/password/reset",authenticate,(req,res,next) => controler.resetPassword(req,res,next));
userRouter.post("/google/auth",(req,res,next)=>{controler.googleAuth(req,res,next)});
userRouter.get("/suggessions",authenticate,(req,res,next)=>controler.suggessions(req,res,next));
userRouter.get('/search',authenticate,(req,res,next)=>controler.searchUser(req,res,next));

// Follow
userRouter.get('/follow',authenticate,(req,res,next)=>controler.followUser(req,res,next))
userRouter.get('/unfollow',authenticate,(req,res,next)=>controler.unFollowUser(req,res,next));
userRouter.get("/follow/check",authenticate,(req,res,next)=>controler.checkUserFollowing(req,res,next))
userRouter.delete("/follow/remove",authenticate,(req,res,next)=>controler.removeFollower(req,res,next))

//OTP 
userRouter.post("/otp/submit/forgetpassword",(req,res,next)=>controler.submitOtpForgetPassword(req,res,next))
userRouter.post('/otp/resend',(req,res,next) => {controler.resendOtp(req,res,next)})
userRouter.post("/otp/submit", (req, res, next) => {controler.verifyOtp(req, res, next);});

// Notification
userRouter.get("/notification",authenticate,(req,res,next)=>controler.getNotification(req,res,next));
userRouter.get('/notification/clear',authenticate,(req,res,next)=>{controler.clearAllNotification(req,res,next)});
userRouter.get("/notification/more",authenticate,(req,res,next)=>controler.showMoreNotification(req,res,next))
userRouter.get('/notification/read',authenticate,(req,res,next)=>controler.readNotification(req,res,next));
userRouter.get('/notification/count',authenticate,(req,res,next)=>controler.getNotificationCount(req,res,next))

// Request
userRouter.get('/requests',authenticate,(req,res,next)=>controler.getAllRequests(req,res,next));
userRouter.get("/requests/accept",authenticate,(req,res,next)=>controler.acceptFollowRequest(req,res,next));
userRouter.get("/requests/reject",authenticate,(req,res,next)=>controler.rejectFollowRequest(req,res,next))

// Profile
userRouter.post("/profile",authenticate,(req,res,next)=>controler.getProfile(req,res,next));
userRouter.post("/profile/following",authenticate,(req,res,next)=>controler.getAllFollowingData(req,res,next))
userRouter.post("/profile/follower",authenticate,(req,res,next)=>controler.getAllFollowerData(req,res,next))
userRouter.post("/profile/image",authenticate,upload.any(),(req,res,next)=>controler.updateProfilePicture(req,res,next));
userRouter.patch('/profile/bio',authenticate,(req,res,next)=>controler.updateBio(req,res,next));
userRouter.put("/profile",authenticate,(req,res,next)=>controler.updateProfile(req,res,next));
userRouter.get("/birthday",authenticate,(req,res,next)=>controler.getBirthdays(req,res,next))



export default userRouter;
