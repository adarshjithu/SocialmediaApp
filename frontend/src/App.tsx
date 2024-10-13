import React, { lazy } from "react";
import Login from "./Pages/User/Login/Login";
import "./App.css";
import Signup from "./Pages/User/Signup/Signup";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import ForgetPassword from "./Pages/User/ForgetPassword/ForgetPassword";
import ResetPassword from "./Pages/User/ResetPassword/ResetPassword";
import VerifyEmail from "./Pages/User/VerifyEmail/VerifyEmai";
import SubmitOtp from "./Pages/User/SubmitOtp/SubmitOtp";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // or other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Home from "./Pages/User/Home/Home";
import { Toaster } from "react-hot-toast";
import forgetPasswordOtp from "./Pages/User/ForgetPasswordOtp/ForgetPasswordOtp";
import ASidebar from "./Components/Admin/ASidebar/ASidebar";
import DashBoard from "./Pages/Admin/DashBoard/DashBoard";
import UserManagement from "./Pages/Admin/UserManagement/UserMangement";
import AdminLogin from "./Pages/Admin/ALogin/ALogin";
import Error404 from "./Pages/Error/404";
import InternalServerError from "./Pages/Error/InternalServerError";
import CreatePost from "./Pages/User/CreatePost/CreatePost";
import CreateVideo from "./Pages/User/CreateVideo/CreateVideo";
import PostManagement from "./Pages/Admin/PostManagement/PostManagement";

import Search from "./Pages/User/Search/Search";
import Requests from "./Pages/User/Requests/Requests";
import Notification from "./Pages/User/Notification/Notification";
import Suggessions from "./Pages/User/Suggessions/Suggessions";
import Profile from "./Pages/User/Profile/Profile";
import Messages from "./Pages/User/Messages/Messages";
import ChatBot from "./Pages/User/ChatBot/ChatBot";
import FeedBack from "./Pages/Admin/FeedBack/FeedBack";

import IncomingCallModal from "./Components/Chat/ReceiveCallComponent";
import VideoCall from "./Components/Video";
import VideoReceiverContainer from "./Components/Chat/VideoReveiverContainer";
import LiveNotification from "./Components/NotificationComponent/LiveNotification";




function App() {
    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <IncomingCallModal/> 
            <VideoReceiverContainer/>
            <LiveNotification/>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" Component={Login} />
                    <Route path="/signup" Component={Signup} />
                    <Route path="/forget-password" Component={ForgetPassword} />
                    <Route path="/reset-password" Component={ResetPassword} />
                    <Route path="/verify-email" Component={VerifyEmail} />
                    <Route path="/submit-otp" Component={SubmitOtp} />
                    <Route path="/" Component={Home} />
                    <Route path="/forget-password-otp" Component={forgetPasswordOtp} />
                    <Route
                        path="/admin"
                        element={
                            <ASidebar>
                                <DashBoard />
                            </ASidebar>
                        }
                    />
                    <Route
                        path="/admin/usermanagement"
                        element={
                            <ASidebar>
                                <UserManagement />
                            </ASidebar>
                        }
                    />
                    <Route
                        path="/admin/postmanagement"
                        element={
                            <ASidebar>
                                <PostManagement />
                            </ASidebar>
                        }
                    />
                    <Route
                        path="/admin/feedback"
                        element={
                            <ASidebar>
                                <FeedBack />
                            </ASidebar>
                        }
                    />
                    <Route path="/admin/login" Component={AdminLogin} />
                    <Route path="/error/404" Component={Error404} />
                    <Route path="/error/internal" Component={InternalServerError} />
                    <Route path="/create" Component={CreatePost} />
                    <Route path="/create-video" Component={CreateVideo} />
                    <Route path="/profile" Component={Profile} />
                    <Route path="/search" Component={Search} />
                    <Route path="/requests" Component={Requests} />
                    <Route path="/notification" Component={Notification} />
                    <Route path="/suggessions" Component={Suggessions} />
                    <Route path="/messages" Component={Messages} />
                    <Route path="/bot" Component={ChatBot} />
                    <Route path="/videocall" Component={VideoCall} />
              
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
