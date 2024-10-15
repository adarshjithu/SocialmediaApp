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
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = require("../Constants/httpStatusCodes");
const token_1 = require("../Utils/token");
const messages_1 = require("../Constants/messages");
const { OK, BAD_REQUEST, UNAUTHORIZED, CONFLICT } = httpStatusCodes_1.STATUS_CODES;
class UserControler {
    constructor(userServices) {
        this.userServices = userServices;
    }
    // @desc   User registation
    // @route  POST /register
    // @access Public
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const newUser = yield this.userServices.createUser(req.body);
                if (!newUser) {
                    let user = yield this.userServices.registerUser(req.body);
                    if (user.success) {
                        req.session.userData = user.user;
                        res.status(OK).json({
                            success: true,
                            message: "OTP Send for verification..",
                            time: (_a = user === null || user === void 0 ? void 0 : user.user) === null || _a === void 0 ? void 0 : _a.time,
                            otpPlace: (_b = user === null || user === void 0 ? void 0 : user.user) === null || _b === void 0 ? void 0 : _b.email,
                        });
                    }
                    else {
                        res.status(BAD_REQUEST).json({ success: false, message: messages_1.MESSAGES.OTP.VERIFICATION_FAILED });
                    }
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: messages_1.MESSAGES.AUTHENTICATION.DUPLICATE_EMAIL });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   OTP Verification
    // @route  POST /verify-otp
    // @access Public
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('otp', req.body, req.session.userData);
            try {
                //taking req.body.otp and session otp
                //validate otp verifying otp valid or not
                const otp = req.body.otp;
                const userData = req.session.userData;
                const isOtpValid = yield this.userServices.verifyOtp(otp, userData);
                const accessTokenMaxAge = 5 * 60 * 1000;
                const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
                if (isOtpValid === null || isOtpValid === void 0 ? void 0 : isOtpValid.success) {
                    //Is otp valid create new User and JWT
                    const newUser = yield this.userServices.saveUser(userData);
                    if (newUser === null || newUser === void 0 ? void 0 : newUser.success) {
                        res.cookie("access_token", newUser.accessToken, {
                            maxAge: accessTokenMaxAge,
                            secure: true,
                            httpOnly: true,
                            sameSite: "none"
                            // Prevent JavaScript access to the cookie
                        });
                        res.cookie("refresh_token", newUser.refreshToken, {
                            maxAge: refreshTokenMaxAge,
                            secure: true,
                            httpOnly: true,
                            sameSite: "none"
                            // Prevent JavaScript access to the cookie
                        });
                        res.status(OK).json(newUser);
                    }
                    else {
                        res.status(UNAUTHORIZED).json(isOtpValid);
                    }
                }
                else {
                    res.status(UNAUTHORIZED).json(isOtpValid);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   For checking email already exist or not
    // @route  POST /verify-email
    // @access Public
    verifyEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isEmailExists = yield this.userServices.verifyEmail(req.body.email);
                if (isEmailExists) {
                    res.status(CONFLICT).json({ success: false, message: "Email already exists" });
                }
                else {
                    res.status(OK).json({ success: true });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   For resending otp
    // @route  POST /resend-otp
    // @access Public
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let result = yield this.userServices.resendOtp(req.session.userData, req.params.id);
                if (result === null || result === void 0 ? void 0 : result.success) {
                    req.session.userData = result.userData;
                    res.status(OK).json({
                        success: true,
                        message: "OTP Send for verification..",
                        time: (_a = req.session.userData) === null || _a === void 0 ? void 0 : _a.time,
                        otpPlace: (_b = req.session.userData) === null || _b === void 0 ? void 0 : _b.email,
                    });
                }
                else {
                    res.status(BAD_REQUEST).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Logout user
    // @route  GET /logout
    // @access Public
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Clearing the access token cookie
                res.cookie("access_token", "", {
                    maxAge: 0, // Expire immediately
                    httpOnly: true, // Same as set
                    secure: true, // Same as set, especially for production (HTTPS)
                    sameSite: 'none' // Same as set
                });
                // Clearing the refresh token cookie
                res.cookie("refresh_token", "", {
                    maxAge: 0, // Expire immediately
                    httpOnly: true, // Same as set
                    secure: true, // Same as set
                    sameSite: 'none' // Same as set
                });
                // Responding with a success message
                res.status(200).json({ success: true, message: "User logout successful" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Login user
    // @route  Post /login
    // @access Public
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessTokenMaxAge = 5 * 60 * 1000; // 5 minutes
                const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours
                const result = yield this.userServices.userLogin(req.body);
                if (result === null || result === void 0 ? void 0 : result.success) {
                    // Ensure the tokens are defined as strings
                    const accessToken = (result === null || result === void 0 ? void 0 : result.accessToken) || "";
                    const refreshToken = (result === null || result === void 0 ? void 0 : result.refreshToken) || "";
                    res.status(200) // Status code 200 for OK
                        .cookie("access_token", accessToken, {
                        maxAge: accessTokenMaxAge,
                        secure: true,
                        httpOnly: true,
                        sameSite: "none"
                        // Prevent JavaScript access to the cookie
                    })
                        .cookie("refresh_token", refreshToken, {
                        maxAge: refreshTokenMaxAge,
                        secure: true,
                        httpOnly: true,
                        sameSite: 'none' // Always use secure cookies
                        // Prevent JavaScript access to the cookie
                    })
                        .json({ success: true, user: result === null || result === void 0 ? void 0 : result.user, message: result === null || result === void 0 ? void 0 : result.message });
                }
                else {
                    res.status(401).json(result); // Status code 401 for Unauthorized
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   For refreshing accesstoken
    // @route  POST /refresh-token
    // @access Private
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refresh_token } = req.cookies;
            // Check if the refresh token is present
            if (!refresh_token) {
                res.status(401).json({ success: false, message: "No Refresh Token Found" });
            }
            try {
                // Verify the refresh token
                const decoded = (0, token_1.verifyRefreshToken)(refresh_token);
                // Check if the user associated with the refresh token exists
                const user = yield this.userServices.findUserById(decoded.data);
                if (!user) {
                    res.status(401).json({ success: false, message: "Invalid refresh token" });
                }
                // Generate a new access token
                const newAccessToken = (0, token_1.generateAccessToken)(user === null || user === void 0 ? void 0 : user._id);
                // Set the new access token in a cookie (if needed)
                res.cookie("access_token", newAccessToken, {
                    maxAge: 5 * 60 * 1000, // 5 minutes
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                // Respond with the new access token (if you need it in the response body)
                res.json({ success: true, access_token: newAccessToken });
            }
            catch (error) {
                // Handle errors such as token verification failure
                console.error("Error refreshing token:", error);
                res.status(401).json({ success: false, message: "Invalid refresh token" });
            }
        });
    }
    // @desc   For forgeting password
    // @route  POST /forget-password
    // @access Public
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.session.forgetData)
                    res.status(BAD_REQUEST).json({ success: false, message: "No User Found" });
                const result = yield this.userServices.forgetPassword(req.body.password, (_a = req.session.forgetData) === null || _a === void 0 ? void 0 : _a.user._id);
                if (result.success) {
                    res.status(OK).json(result);
                }
                else {
                    res.status(BAD_REQUEST).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   For Verify email or phonenumber
    // @route  POST /verify-user
    // @access Public
    verifyUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.verifyUser(req.body);
                if (result.success) {
                    req.session.forgetData = result;
                    res.status(OK).json({ success: true, time: result.time, userId: result.user._id, message: "Otp send for verification" });
                }
                else {
                    res.status(BAD_REQUEST).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   For For reseting password of user
    // @route  POST /reset-password
    // @access Private
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.resetPassword(req.body, req === null || req === void 0 ? void 0 : req.userId);
                if (result.success) {
                    res.status(OK).json(result);
                }
                else {
                    res.status(400).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   For For reseting password of user
    // @route  POST /reset-password
    // @access Private
    submitOtpForgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const time = (_a = req.session.forgetData) === null || _a === void 0 ? void 0 : _a.time;
                const otp = (_b = req.body) === null || _b === void 0 ? void 0 : _b.otp;
                const timeInSec = Math.floor((Date.now() - time) / 1000);
                if (timeInSec > 30) {
                    res.status(BAD_REQUEST).json({ success: false, message: messages_1.MESSAGES.OTP.EXPIRED });
                }
                if (otp == ((_d = (_c = req === null || req === void 0 ? void 0 : req.session) === null || _c === void 0 ? void 0 : _c.forgetData) === null || _d === void 0 ? void 0 : _d.forgetotp)) {
                    res.status(OK).json({ success: true, message: messages_1.MESSAGES.OTP.SUCCESS });
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: messages_1.MESSAGES.OTP.INVALID });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Google authentication
    // @route  POST /googe/auth
    // @access Public
    googleAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessTokenMaxAge = 5 * 60 * 1000;
                const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
                const result = yield this.userServices.googleAuthentication(req.body);
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
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Suggesions
    // @route  POST /suggessions
    // @access Public
    suggessions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.getSuggessions(req.userId);
                if (result)
                    res.status(OK).json({ success: true, users: result });
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Follow user
    // @route  GET /follow
    // @access Private
    followUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.follow(req.query.followerId, req.userId);
                if (result)
                    res.status(OK).json({ success: true });
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Unfollow user
    // @route  GET /unfollow
    // @access Private
    unFollowUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.unFollowUser(req.query.followerId, req.userId);
                if (result)
                    res.status(OK).json({ success: true });
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Unfollow user
    // @route  GET /search
    // @access Private
    searchUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.searchUser(req.query.query, req.userId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else {
                    res.status(OK).json({ success: false });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get profile user
    // @route  GET /profile
    // @access Private
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.getProfile(req.body.status ? req.userId : req.body.userId);
                if (result)
                    res.status(OK).json(result);
                else {
                    res.status(BAD_REQUEST).json({ success: false });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc   Get Notifications
    // @route  GET /notifications
    // @access Private
    getNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.getNotification(req.userId, req.query.page);
                if (result)
                    res.status(OK).json({ success: true, result: result });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Get all requests
    // @route  GET /requests
    // @access Private
    getAllRequests(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allRequest = yield this.userServices.getAllRequest(req.userId);
                if (allRequest)
                    res.status(OK).json({ success: true, result: allRequest });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Get all requests
    // @route  GET /follow/accept
    // @access Private
    acceptFollowRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.acceptFollowRequest(req.userId, req.query.followerId);
                if (result)
                    res.status(OK).json({ success: true });
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Clear All Notification
    // @route  GET /notifications/clear
    // @access Private
    clearAllNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.clearAllNotifications(req.userId);
                if (result)
                    res.status(OK).json({ success: true, message: "Notifications cleared successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Clear All Notification
    // @route  GET /notifications/clear
    // @access Private
    rejectFollowRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.rejectFollowRequest(req.query.followerId, req.userId);
                if (result)
                    res.status(OK).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Clear All Notification
    // @route  GET /profile/image
    // @access Private
    updateProfilePicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.updateProfilePicture(req.files, req.userId);
                if (result)
                    res.status(OK).json(result);
                else
                    res.status(BAD_REQUEST).json({ success: false, message: "Profile picture updation failed" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Update bio
    // @route  GET /profile/bio
    // @access Private
    updateBio(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.updateBio(req.userId, req.body.bio);
                if (result)
                    res.status(OK).json({ success: true, bio: req.body.bio });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Update Profile
    // @route  PUT /profile
    // @access Private
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.updateProfile(req.userId, req.body);
                if (result)
                    res.status(OK).json({ success: true, message: "Profile updated successfully" });
                else
                    res.status(BAD_REQUEST).json({ success: false, message: "Profile updation failed" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Update Profile
    // @route  PUT /profile
    // @access Private
    getBirthdays(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.getBirthdays(req.userId);
                if (result)
                    res.status(OK).json({ success: true, result: result });
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Check user following
    // @route  Get /follow/check
    // @access Private
    checkUserFollowing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.checkUserFollowing(req.userId, req.query.followerId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Remove follower
    // @route  Get /follow/remove
    // @access Private
    removeFollower(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.removeFollower(req.userId, req.query.followerId);
                if (result) {
                    res.status(OK).json({ success: true });
                }
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Get all the following data
    // @route  POST /profile/following
    // @access Private
    getAllFollowingData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.getAllFollowing(req.userId, req.body);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Get all the follower data
    // @route  POST /profile/follower
    // @access Private
    getAllFollowerData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.getAllFollower(req.userId, req.body);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Show more notification
    // @route  GET /notification/more
    // @access Private
    showMoreNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.showMoreNotification(req.userId, req.query.page);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Make all notifications as read
    // @route  GET /notification/read
    // @access Private
    readNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.readNotification(req.userId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // @desc Get notification count
    // @route  GET /notification/count
    // @access Private
    getNotificationCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.getNotificationCount(req.userId);
                if (result) {
                    res.status(OK).json({ success: true, result: result });
                }
                else
                    res.status(BAD_REQUEST).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserControler;
