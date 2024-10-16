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
const userModel_1 = require("../Models/userModel");
const otp_1 = require("../Utils/otp");
const password_1 = require("../Utils/password");
const token_1 = require("../Utils/token");
const sendOtpToEmail_1 = require("../Utils/sendOtpToEmail");
const messages_1 = require("../Constants/messages");
const upload_1 = require("../Utils/upload");
const OTPmodel_1 = __importDefault(require("../Models/OTPmodel"));
const sendOtoToMobile_1 = require("../Utils/sendOtoToMobile");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    // Register with email
    registerWithEmail(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const newUser = yield this.userRepository.emailExist(userData.email);
                if (!newUser) {
                    const otp = (0, otp_1.generateOtp)();
                    const isOtpSend = yield (0, sendOtpToEmail_1.sentOtpToEmail)(userData.email, otp);
                    if (isOtpSend) {
                        userData.time = Date.now();
                        userData.otp = otp;
                        const saveTempData = yield this.userRepository.createTempData(userData);
                        const userObj = {
                            _id: saveTempData === null || saveTempData === void 0 ? void 0 : saveTempData._id,
                            time: (_a = saveTempData === null || saveTempData === void 0 ? void 0 : saveTempData.userData) === null || _a === void 0 ? void 0 : _a.time,
                            otpMethod: saveTempData === null || saveTempData === void 0 ? void 0 : saveTempData.userData.otpMethod,
                            email: (_b = saveTempData === null || saveTempData === void 0 ? void 0 : saveTempData.userData) === null || _b === void 0 ? void 0 : _b.email,
                            phonenumber: (_c = saveTempData === null || saveTempData === void 0 ? void 0 : saveTempData.userData) === null || _c === void 0 ? void 0 : _c.phonenumber,
                        };
                        if (saveTempData) {
                            return {
                                success: true,
                                user: userObj,
                                message: "Your OTP has been successfully sent to your email address. Please check your inbox and enter the OTP to continue.",
                            };
                        }
                        else {
                            return { success: false, message: messages_1.MESSAGES.OTP.FAILED };
                        }
                    }
                    else {
                        return { success: false, message: messages_1.MESSAGES.OTP.FAILED };
                    }
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.DUPLICATE_EMAIL };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.OTP.FAILED };
            }
        });
    }
    // Register with phonenumber
    registerWithMobile(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.userRepository.emailExist(userData.email);
                if (!newUser) {
                    const otp = (0, otp_1.generateOtp)();
                    const isOtpSend = yield (0, sendOtoToMobile_1.sendOtpToPhone)(userData.phonenumber, otp);
                    if (isOtpSend) {
                        userData.time = Date.now();
                        const saveTempData = yield this.userRepository.createTempData(userData);
                        if (saveTempData) {
                            return { success: true, user: saveTempData, message: "OTP send to your email " };
                        }
                        else {
                            return { success: false, message: messages_1.MESSAGES.OTP.FAILED };
                        }
                    }
                    else {
                        return { success: false, message: "Something went wrong please try sending to email" };
                    }
                }
                else {
                    return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.DUPLICATE_EMAIL };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.OTP.FAILED };
            }
        });
    }
    // Checking email exists or not
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.userRepository.emailExist(userData.email);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Verify OTP in signup
    verifyOtp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const user = yield OTPmodel_1.default.findOne({ _id: userData._id });
                const curTime = Date.now();
                const otpTime = (_a = user === null || user === void 0 ? void 0 : user.userData) === null || _a === void 0 ? void 0 : _a.time;
                let timeInSec = Math.floor((curTime - otpTime) / 1000);
                if (timeInSec > 30) {
                    return { success: false, message: "The OTP has expired. Please request a new OTP to proceed." };
                }
                else {
                    if ((userData === null || userData === void 0 ? void 0 : userData.otp) == ((_b = user === null || user === void 0 ? void 0 : user.userData) === null || _b === void 0 ? void 0 : _b.otp)) {
                        return { success: true, user: user, message: "OTP verification successfull " };
                    }
                    else {
                        return { success: false, message: "The OTP you entered is incorrect. Please try again." };
                    }
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.OTP.FAILED };
            }
        });
    }
    // Save all the user after OTP verification in the database
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                userData.password = yield (0, password_1.hashPassword)(userData.password);
                const user = yield this.userRepository.saveUser(userData);
                if (user) {
                    const userId = String(user === null || user === void 0 ? void 0 : user._id);
                    const accessToken = (0, token_1.generateAccessToken)(userId);
                    const refreshToken = (0, token_1.generateRefreshToken)(userId);
                    return {
                        success: true,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        user: user,
                        message: messages_1.MESSAGES.AUTHENTICATION.SUCCESS,
                    };
                }
                else {
                    return {
                        success: false,
                        message: messages_1.MESSAGES.AUTHENTICATION.FAIL,
                    };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    // For Verifying email
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.checkEmail(email);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // For resending otp in the signup processs
    resendOtp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, otp_1.generateOtp)();
                if (userData.otpMethod == "email") {
                    const otpSend = yield (0, sendOtpToEmail_1.sentOtpToEmail)(userData.email, otp);
                    if (otpSend) {
                        const time = Date.now();
                        const res = yield OTPmodel_1.default.updateOne({ _id: userData._id }, { $set: { "userData.time": time, "userData.otp": otp } });
                        if (res) {
                            return {
                                success: true,
                                user: Object.assign(Object.assign({}, userData), { time: time, otp: otp }),
                                message: "Your OTP has been successfully sent to your email",
                            };
                        }
                        else {
                            return { success: false, message: "Something went wrong" };
                        }
                    }
                    else {
                        return { success: false, message: "Something went wrong please try again" };
                    }
                }
                else {
                    const otpSend = yield (0, sendOtoToMobile_1.sendOtpToPhone)(userData.phonenumber, otp);
                    if (otpSend) {
                        const time = Date.now();
                        const res = yield OTPmodel_1.default.updateOne({ _id: userData._id }, { $set: { time: time } });
                        if (res) {
                            return {
                                success: true,
                                user: Object.assign(Object.assign({}, userData), { time: time, otp: otp }),
                                message: "Your OTP has been successfully sent to your email",
                            };
                        }
                        else {
                            return { success: false, message: "Something went wrong" };
                        }
                    }
                    else {
                        return { success: false, message: "Something went wrong please try again" };
                    }
                }
                return null;
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.OTP.FAILED };
            }
        });
    }
    // Registering user while signup with otp
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, otp_1.generateOtp)();
                if (yield (0, otp_1.sendOtp)(userData, otp)) {
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
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    // For login user
    userLogin(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.checkEmail(userData.email);
                if (!user) {
                    return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.INVALID_USER };
                }
                else {
                    if (user.isBlocked) {
                        return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.BLOCK_USER };
                    }
                    const isPasswordValid = yield (0, password_1.comparePassword)(userData.password, user.password);
                    if (isPasswordValid) {
                        const accessToken = (0, token_1.generateAccessToken)(String(user === null || user === void 0 ? void 0 : user._id));
                        const refreshToken = (0, token_1.generateRefreshToken)(String(user === null || user === void 0 ? void 0 : user._id));
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
                                username: (user === null || user === void 0 ? void 0 : user.username) || "",
                                bio: (user === null || user === void 0 ? void 0 : user.bio) || "",
                                dateofbirth: (user === null || user === void 0 ? void 0 : user.dateofbirth) || "",
                                image: (user === null || user === void 0 ? void 0 : user.image) || "",
                            },
                            message: messages_1.MESSAGES.AUTHENTICATION.SUCCESS,
                        };
                    }
                    else {
                        return {
                            success: false,
                            message: messages_1.MESSAGES.AUTHENTICATION.INVALID_PASSWORD,
                        };
                    }
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.FAIL };
            }
        });
    }
    // Find user byid
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findById(id);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    verifyUser(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValid = (0, token_1.validateInput)(arg.type);
                if (isValid.type == "email") {
                    const user = yield userModel_1.User.findOne({ email: arg.type });
                    if (!user) {
                        return { success: false, message: "User not found with this email" };
                    }
                    else {
                        const otp = (0, otp_1.generateOtp)();
                        const isOtpSend = yield (0, sendOtpToEmail_1.sentOtpToEmail)(arg.type, otp);
                        if (isOtpSend) {
                            const tempData = new OTPmodel_1.default({ userData: { time: Date.now(), otpMethod: "email", email: arg.type, otp: otp } });
                            yield tempData.save();
                            return {
                                success: true,
                                time: tempData.userData.time,
                                id: tempData._id,
                                otpMethod: "email",
                                message: "OTP has been successfully send to you email",
                                email: arg === null || arg === void 0 ? void 0 : arg.type,
                            };
                        }
                        else {
                            return { success: false, message: "Failed to send otp to the email " };
                        }
                    }
                }
                else if (isValid.type == "phonenumber") {
                    const user = yield userModel_1.User.findOne({ phonenumber: arg.type });
                    if (!user) {
                        return { success: false, message: "User not found with this Phonenumber" };
                    }
                    else {
                        const otp = (0, otp_1.generateOtp)();
                        const isOtpSend = yield (0, sendOtoToMobile_1.sendOtpToPhone)(arg.type, otp);
                        if (isOtpSend) {
                            const tempData = new OTPmodel_1.default({ userData: { time: Date.now(), otpMethod: "phonenumber", phonenumber: arg.type, otp: otp } });
                            yield tempData.save();
                            return {
                                success: true,
                                time: tempData.userData.time,
                                id: tempData._id,
                                otpMethod: "phonenumber",
                                message: "OTP has been successfully send to you phonenumber",
                            };
                        }
                        else {
                            return { success: false, message: "Failed to send OTP to the mobile number please try email " };
                        }
                    }
                }
                else {
                    return { success: false, message: "Invalid input: Enter a valid email or 10-digit phone number" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    // Reset password
    resetPassword(userData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user) {
                    return {
                        success: false,
                        message: "User not found",
                    };
                }
                if (userData.oldpassword == userData.newpassword) {
                    return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.REFUSED_PASSWORD };
                }
                const isPasswordValid = yield (0, password_1.comparePassword)(userData.oldpassword, user.password);
                if (isPasswordValid) {
                    const newPassword = yield (0, password_1.hashPassword)(userData.newpassword);
                    let result = yield this.userRepository.updatePassword(newPassword, userId);
                    if (result) {
                        return { success: true, message: messages_1.MESSAGES.AUTHENTICATION.PASSWORD_SUCCESS };
                    }
                    else {
                        return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.PASSWORD_FAIL };
                    }
                }
                else {
                    return {
                        success: false,
                        message: messages_1.MESSAGES.AUTHENTICATION.INVALID_PASSWORD,
                    };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.PASSWORD_FAIL };
            }
        });
    }
    // Forget password
    forgetPassword(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const details = yield OTPmodel_1.default.findOne({ _id: userData === null || userData === void 0 ? void 0 : userData.id });
                const user = yield userModel_1.User.findOne({ $or: [{ email: (_a = details === null || details === void 0 ? void 0 : details.userData) === null || _a === void 0 ? void 0 : _a.email }, { phonenumber: (_b = details === null || details === void 0 ? void 0 : details.userData) === null || _b === void 0 ? void 0 : _b.phonenumber }] });
                const isSamePass = yield (0, password_1.comparePassword)(userData === null || userData === void 0 ? void 0 : userData.password, user === null || user === void 0 ? void 0 : user.password);
                if (isSamePass) {
                    return {
                        success: false,
                        message: messages_1.MESSAGES.AUTHENTICATION.REFUSED_PASSWORD,
                    };
                }
                const hashPass = yield (0, password_1.hashPassword)(userData === null || userData === void 0 ? void 0 : userData.password);
                yield userModel_1.User.updateOne({ _id: user === null || user === void 0 ? void 0 : user._id }, { $set: { password: hashPass } });
                return {
                    success: true,
                    message: messages_1.MESSAGES.AUTHENTICATION.PASSWORD_SUCCESS,
                };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.FAIL };
            }
        });
    }
    // Google Authentication
    googleAuthentication(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isEmailExists = yield this.userRepository.emailExist(userData.email);
                if (isEmailExists) {
                    const accessToken = (0, token_1.generateAccessToken)(isEmailExists._id);
                    const refreshToken = (0, token_1.generateRefreshToken)(isEmailExists._id);
                    return {
                        success: true,
                        message: messages_1.MESSAGES.AUTHENTICATION.SUCCESS,
                        user: isEmailExists,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    };
                }
                else {
                    const password = String(Math.floor(Math.random() * 1000000));
                    userData.password = yield (0, password_1.hashPassword)(`${password}`);
                    const res = yield this.userRepository.createUser(userData);
                    if (res) {
                        const accessToken = (0, token_1.generateAccessToken)(res._id);
                        const refreshToken = (0, token_1.generateRefreshToken)(res._id);
                        return {
                            success: true,
                            message: messages_1.MESSAGES.AUTHENTICATION.SUCCESS,
                            user: res,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                        };
                    }
                    else {
                        return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.FAIL };
                    }
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: messages_1.MESSAGES.AUTHENTICATION.FAIL };
            }
        });
    }
    // Forget password
    getSuggessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getSuggessions(userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Follow user
    follow(followerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Checking the user is private or not
                const user = yield this.userRepository.findById(userId);
                if (!(user === null || user === void 0 ? void 0 : user.isPrivate)) {
                    yield this.userRepository.addFollowers(followerId, userId);
                }
                //Sending notifications
                if (String(followerId) !== String(userId)) {
                    yield this.userRepository.addNotification(followerId, {
                        userId: userId,
                        message: "follow",
                        image: "",
                        data: "",
                        createdAt: new Date(),
                    });
                }
                yield this.userRepository.addFollowing(followerId, userId);
                yield this.userRepository.addRequest(followerId, userId);
                return { success: true };
            }
            catch (error) {
                {
                    success: false;
                }
                console.log(error);
            }
        });
    }
    // Unfollow user
    unFollowUser(followerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.unFollow(followerId, userId);
                yield this.userRepository.removeRequest(followerId, userId);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Search User
    searchUser(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.searchUser(query, userId);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Search User
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.getProfile(userId);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all notification
    getNotification(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.userRepository.getNotification(userId, page);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all notification
    getAllRequest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.userRepository.getAllRequest(userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all notification
    acceptFollowRequest(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.removeRequest(userId, followerId);
                yield this.userRepository.addFollowing(followerId, userId);
                yield this.userRepository.addFollowers(followerId, userId);
                const user = yield this.userRepository.findById(userId);
                // if (!user?.isPrivate) {
                //     await this.userRepository.addFollowers(followerId, userId);
                // }
                //Sending notifications
                if (String(followerId) !== String(userId)) {
                    yield this.userRepository.addNotification(followerId, {
                        userId: userId,
                        message: "follow accept",
                        image: "",
                        data: "",
                        createdAt: new Date(),
                    });
                }
                return { success: true };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Clear all the notifications for a user
    clearAllNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.clearAllNotifications(userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Reject follow request
    rejectFollowRequest(followerId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.removeRequest(userId, followerId);
                yield this.userRepository.removeFollower(userId, followerId);
                return yield this.userRepository.removeFollowing(userId, followerId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Update profile picture
    updateProfilePicture(files, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield (0, upload_1.uploadImageToCloudinary)(files);
                if (!result.success)
                    return { success: false, message: "Profile picture updation failed" };
                const images = (_a = result === null || result === void 0 ? void 0 : result.results) === null || _a === void 0 ? void 0 : _a.map((obj) => obj === null || obj === void 0 ? void 0 : obj.url);
                if (images) {
                    const res = yield this.userRepository.updateProfilePicture(userId, images[0]);
                    if (res)
                        return { success: true, image: images[0] };
                    else {
                        return { success: false, message: "Profile picture updation Failed" };
                    }
                }
                else {
                    if (!result.success)
                        return { success: false, message: "Profile picture updation failed" };
                }
                return null;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Update bio
    updateBio(userId, bio) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.updateBio(userId, bio);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Update bio
    updateProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.updateProfile(userId, profileData);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // getBirthday
    getBirthdays(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const birthdays = yield this.userRepository.getTodayBirthdays(userId);
                const allFriends = yield this.userRepository.getAllFriends(userId);
                const allBirthdayUsers = [];
                birthdays === null || birthdays === void 0 ? void 0 : birthdays.birthdays.map((obj) => {
                    allFriends === null || allFriends === void 0 ? void 0 : allFriends.followers.forEach((i) => {
                        if (String(obj) == String(i._id))
                            allBirthdayUsers.push(JSON.stringify(i));
                    });
                    allFriends === null || allFriends === void 0 ? void 0 : allFriends.following.forEach((i) => {
                        if (String(obj) == String(i._id))
                            allBirthdayUsers.push(JSON.stringify(i));
                    });
                });
                const result = [...new Set(allBirthdayUsers)];
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // CheckUserFollowing
    checkUserFollowing(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.userRepository.checkUserFollowing(userId, followerId);
                if ((res === null || res === void 0 ? void 0 : res.length) == 0)
                    return { success: false };
                else
                    return { success: true };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Remove follower
    removeFollower(userId, followerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.removeFollower(userId, followerId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all the following data
    getAllFollowing(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAllFollowing(userId, data);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get all the follower data
    getAllFollower(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAllFollower(userId, data);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Get more notification
    showMoreNotification(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.showMoreNotification(userId, page);
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
                return yield this.userRepository.readNotification(userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //Get notification count
    getNotificationCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getNotificationCount(userId);
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // Resend otp for forget password
    resendForgetOtp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log(userData);
                const otp = (0, otp_1.generateOtp)();
                const userId = userData === null || userData === void 0 ? void 0 : userData.id;
                if ((userData === null || userData === void 0 ? void 0 : userData.otpMethod) == "email") {
                    const details = yield OTPmodel_1.default.findOne({ _id: userId });
                    const isOtpSend = yield (0, sendOtpToEmail_1.sentOtpToEmail)((_a = details === null || details === void 0 ? void 0 : details.userData) === null || _a === void 0 ? void 0 : _a.email, otp);
                    if (isOtpSend) {
                        const time = Date.now();
                        yield OTPmodel_1.default.updateOne({ _id: userId }, { $set: { "userData.time": time, "userData.otp": otp } });
                        return Object.assign(Object.assign({}, userData), { time: time });
                    }
                    else {
                        return { success: false, message: "Failed to send otp to you email" };
                    }
                }
                else {
                }
                return null;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = UserService;
