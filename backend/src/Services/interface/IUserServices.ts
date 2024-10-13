import { ResetPasswordInterface } from "../../Inteface/userInterfaces";
import { IUser } from "../../Models/userModel";

export interface IUserServices {
     createUser(userData: IUser): Promise<IUser | null>;
     verifyOtp(otp: number, userData: any): Promise<Record<string, any> | null>;
     saveUser(userData: any): Promise<Record<string, any> | undefined | null>;
     verifyEmail(email: string): Promise<IUser | null>;
     resendOtp(userData: any, id: string): Promise<Record<string, any> | null>;
     registerUser(userData: IUser): Promise<any>;
     userLogin(userData: any): Promise<Record<string, any> | null>;
     findUserById(id: string): Promise<any>;
     verifyUser(arg: any): Promise<any>;
     resetPassword(userData: ResetPasswordInterface, userId: string): Promise<any>;
     googleAuthentication(userData: IUser): Promise<any>;
     forgetPassword(pass: string, userId: string): Promise<any>;
}
