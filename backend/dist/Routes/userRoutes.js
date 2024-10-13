"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepository_1 = __importDefault(require("../Repositories/user/userRepository"));
const userService_1 = __importDefault(require("../Services/userService"));
const userControler_1 = __importDefault(require("../Controlers/userControler"));
const userAuth_1 = require("../Middleware/userAuth");
const upload_1 = __importDefault(require("../Middleware/upload"));
const userRouter = express_1.default.Router();
// userRouter.get("/register", (req, res) => {});
const userRepository = new userRepository_1.default();
const userServices = new userService_1.default(userRepository);
const controler = new userControler_1.default(userServices);
// Authentication
userRouter.post("/register", (req, res, next) => { controler.registerUser(req, res, next); });
userRouter.post('/verify-email', (req, res, next) => controler.verifyEmail(req, res, next));
userRouter.get("/logout", (req, res, next) => controler.logout(req, res, next)); //
userRouter.post("/login", (req, res, next) => controler.login(req, res, next));
userRouter.post("/refresh-token", (req, res, next) => controler.refreshToken(req, res, next));
userRouter.post("/password/forget", (req, res, next) => controler.forgetPassword(req, res, next));
userRouter.post("/verify-user", (req, res, next) => controler.verifyUser(req, res, next));
userRouter.post("/password/reset", userAuth_1.authenticate, (req, res, next) => controler.resetPassword(req, res, next));
userRouter.post("/google/auth", (req, res, next) => { controler.googleAuth(req, res, next); });
userRouter.get("/suggessions", userAuth_1.authenticate, (req, res, next) => controler.suggessions(req, res, next));
userRouter.get('/search', userAuth_1.authenticate, (req, res, next) => controler.searchUser(req, res, next));
// Follow
userRouter.get('/follow', userAuth_1.authenticate, (req, res, next) => controler.followUser(req, res, next));
userRouter.get('/unfollow', userAuth_1.authenticate, (req, res, next) => controler.unFollowUser(req, res, next));
userRouter.get("/follow/check", userAuth_1.authenticate, (req, res, next) => controler.checkUserFollowing(req, res, next));
userRouter.delete("/follow/remove", userAuth_1.authenticate, (req, res, next) => controler.removeFollower(req, res, next));
//OTP 
userRouter.post("/otp/submit/forgetpassword", (req, res, next) => controler.submitOtpForgetPassword(req, res, next));
userRouter.get('/otp/resend/:id', (req, res, next) => { controler.resendOtp(req, res, next); });
userRouter.post("/otp/submit", (req, res, next) => { controler.verifyOtp(req, res, next); });
// Notification
userRouter.get("/notification", userAuth_1.authenticate, (req, res, next) => controler.getNotification(req, res, next));
userRouter.get('/notification/clear', userAuth_1.authenticate, (req, res, next) => { controler.clearAllNotification(req, res, next); });
userRouter.get("/notification/more", userAuth_1.authenticate, (req, res, next) => controler.showMoreNotification(req, res, next));
userRouter.get('/notification/read', userAuth_1.authenticate, (req, res, next) => controler.readNotification(req, res, next));
userRouter.get('/notification/count', userAuth_1.authenticate, (req, res, next) => controler.getNotificationCount(req, res, next));
// Request
userRouter.get('/requests', userAuth_1.authenticate, (req, res, next) => controler.getAllRequests(req, res, next));
userRouter.get("/requests/accept", userAuth_1.authenticate, (req, res, next) => controler.acceptFollowRequest(req, res, next));
userRouter.get("/requests/reject", userAuth_1.authenticate, (req, res, next) => controler.rejectFollowRequest(req, res, next));
// Profile
userRouter.post("/profile", userAuth_1.authenticate, (req, res, next) => controler.getProfile(req, res, next));
userRouter.post("/profile/following", userAuth_1.authenticate, (req, res, next) => controler.getAllFollowingData(req, res, next));
userRouter.post("/profile/follower", userAuth_1.authenticate, (req, res, next) => controler.getAllFollowerData(req, res, next));
userRouter.post("/profile/image", userAuth_1.authenticate, upload_1.default.any(), (req, res, next) => controler.updateProfilePicture(req, res, next));
userRouter.patch('/profile/bio', userAuth_1.authenticate, (req, res, next) => controler.updateBio(req, res, next));
userRouter.put("/profile", userAuth_1.authenticate, (req, res, next) => controler.updateProfile(req, res, next));
userRouter.get("/birthday", userAuth_1.authenticate, (req, res, next) => controler.getBirthdays(req, res, next));
exports.default = userRouter;
