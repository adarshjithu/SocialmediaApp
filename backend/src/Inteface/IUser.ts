import mongoose from "mongoose";
import { IUser } from "../Models/userModel";

export interface Iuser{
    name:string;
    username?:string
    email:string;
    phonenumber:string;
    password:string;
    confirmpassword?:string;
}


export interface IResponse {
    success?: boolean;
    message?: string;
    user?: Partial<IUser>;
    userData?: Partial<Iuser>;
}

export interface IRegister {
    success?: boolean;
    message?: string; 
    accessToken?: string;
    refreshToken?: string;
    user?: Partial<IUser>;
}

export interface VerifyUserInterface {
    success?: boolean;
    message?: string;
    forgetotp?: string | number;
    user?: Partial<IUser>;
    time?: string | number;
}

export interface ShareResponse {
    _id:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    following:any[];
    followers:any[]
}
