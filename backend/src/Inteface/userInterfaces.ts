import mongoose, { StringExpressionOperatorReturningString } from "mongoose";

export interface ResetPasswordInterface {
    oldpassword: string;
    newpassword: string;
    confirmpassword: string;
}


export interface INotification{
    userId:string;
    message:string;
    postId:string;
    image?:string
}

export interface INotificationObj {
    userId?:string|mongoose.Types.ObjectId
    message?:string;
    postId?:string|mongoose.Types.ObjectId
    image?:string;
    data?:string;
    createdAt?:Date
}


export interface IEditProfile {
    name?:string;
    username?:string;
    email?:string;
    phonenumber?:number;
    dateofbirth?:string
}