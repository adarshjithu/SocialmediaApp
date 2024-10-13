import { SignupInterface } from "../../Pages/User/Signup/Signup";
import axiosInstance from "../api";
import errorHandler from "../erroHandler";
import { ResetPasswordInterface } from "../../Pages/User/ResetPassword/ResetPassword";
import { IEditProfile } from "../../interfaces/Interface";

//User registration
export const registerUser = async (userDetails: SignupInterface) => {
    try {
        const response = await axiosInstance.post("/register", userDetails);
        console.log(response, "res");
        return response;
    } catch (error) {
        errorHandler(error);
    }
};

//Otp Verfication
export const submitOtp = async (otp: string) => {
    try {
        const response = await axiosInstance.post("/otp/submit", { otp: otp });
        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//Checking Email already exists or not;
export const verifyEmail = async (email: string) => {
    try {
        const response = await axiosInstance.post("/verify-email", { email: email });
        console.log("re", response);
        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//Resend OTP
export const resendOTP = async (arg: string | null) => {
    try {
        const response = await axiosInstance.get(`/otp/resend/id:${arg}`);
        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//Logout
export const logoutUser = async () => {
    try {
        const response = await axiosInstance.get("/logout");
        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//Login
export const loginUser = async (arg: Object) => {
    try {
        const response = await axiosInstance.post(`/login`, arg);
        console.log(response, "resonse");
        return response.data;

        // return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//ForgetPassword
export const forgetPassword = async (FormData: any) => {
    try {
        const response = await axiosInstance.post(`/password/forget`, FormData);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};
//VerifyUser
export const verifyUser = async (arg: string) => {
    try {
        const response = await axiosInstance.post(`/verify-user`, { type: arg });

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//ResetPassword
export const resetPassword = async (arg: ResetPasswordInterface) => {
    try {
        const response = await axiosInstance.post(`/password/reset`, arg);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};
//submitOtpForForgetPassword
export const submitOtpForForgetPassword = async (arg: string) => {
    try {
        const response = await axiosInstance.post(`/otp/submit/forgetpassword`, { otp: arg });

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};
//userSuggessions
export const userSuggessions = async () => {
    try {
        const response = await axiosInstance.get(`/suggessions`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//followUser
export const followUser = async (id: string) => {
    try {
        console.log("follow call");
        const response = await axiosInstance.get(`/follow?followerId=${id}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//unfollow user
export const unFollowUser = async (id: string) => {
    try {
        console.log("call", id);
        const response = await axiosInstance.get(`/unfollow?followerId=${id}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//unfollow user
export const searchUser = async (query: string) => {
    try {
        const response = await axiosInstance.get(`/search?query=${query}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//unfollow user
export const getProfile = async (isCurrentUser: { status: boolean; userId: string }) => {
    try {
 
        const response = await axiosInstance.post(`/profile`, isCurrentUser);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//unfollow user
export const getNotifications = async () => {
    try {
        const response = await axiosInstance.get(`/notifications`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//unfollow user
export const getAllRequests = async () => {
    console.log("call");

    try {
        const response = await axiosInstance.get(`/requests`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//Accept follow request
export const acceptFollowRequest = async (followerId: string) => {
    console.log("call");

    try {
        const response = await axiosInstance.get(`/requests/accept?followerId=${followerId}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//Accept follow request
export const getAllNotification = async (page:number) => {
    

    try {
        const response = await axiosInstance.get(`/notification?page=${page}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

// ClearAllNotification
export const clearAllNotification = async () => {
    try {
        const response = await axiosInstance.get(`/notification/clear`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//Accept follow request
export const rejectFollowRequest = async (followerId: string) => {
    console.log("call");

    try {
        const response = await axiosInstance.get(`/requests/rejec?followerId=${followerId}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

// Follow user
export const folloUserFromNotification = async (followerId: string) => {
    console.log("call");

    try {
        const response = await axiosInstance.get(`/notification/follow?followerId=${followerId}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

export const updateBio = async (bio: string) => {
    try {
        const response = await axiosInstance.patch(`/profile/bio`, { bio: bio });

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

export const updateProfile = async (data: IEditProfile) => {
    try {
        const response = await axiosInstance.put(`/profile`, data);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

export const getBirthdays = async () => {
    try {
        const response = await axiosInstance.get(`/birthday`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};


export const checkUserFollowingOrNot = async (followerId:string) => {
    try {
        console.log(followerId)
        const response = await axiosInstance.get(`/follow/check?followerId=${followerId}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};


export const removeFollower = async (followerId:string) => {
    try {
     
        const response = await axiosInstance.delete(`/follow/remove?followerId=${followerId}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//unfollow user
export const getAllFollowingInfo = async (isCurrentUser: { status: boolean; userId: string }) => {
    try {
 console.log(isCurrentUser)
        const response = await axiosInstance.post(`/profile/following`, isCurrentUser);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};


//Get all followers info
export const getAllFollowersInfo = async (isCurrentUser: { status: boolean; userId: string }) => {
    try {
 console.log(isCurrentUser)
        const response = await axiosInstance.post(`/profile/follower`, isCurrentUser);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};

//Get all followers info
export const showMoreNotification = async (page:number) => {
    try {

        const response = await axiosInstance.get(`/notification/more?page=${page}`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};


//Get all followers info
export const readAllNotification = async () => {
    try {

        const response = await axiosInstance.get(`/notification/read`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};
//Get notification count
export const getNotificationCount = async () => {
    try {

        const response = await axiosInstance.get(`/notification/count`);

        return response.data;
    } catch (error) {
        errorHandler(error);
    }
};