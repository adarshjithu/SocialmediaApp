import { MESSAGES } from "../Constants/messages";
import {  IDashboard, IRespone, ServiceResponse } from "../Inteface/IAdmin";
import { IPost } from "../Models/postModels";
import { IUser } from "../Models/userModel";
import { AdminRepository } from "../Repositories/admin/adminRepository";
import { comparePassword } from "../Utils/password";
import { generateRefreshToken } from "../Utils/token";
import { IAdminServices } from "./interface/IAdminServices";

export class AdminServices implements IAdminServices {
    constructor(public adminRepository: AdminRepository) {}
    // To get all the user data
    async getAllUsers(page: number, type: string,search:string): Promise<IUser[] | null> {
        try {
            const allUsers = await this.adminRepository.getAllUsers(page, type,search);
            return allUsers;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //For blocking a user
    async blockUser(userId: string): Promise<ServiceResponse | null> {
        try {
            const res = await this.adminRepository.blockUser(userId);

            if (res?.isBlocked) {
                return { success: true, message: MESSAGES.AUTHENTICATION.USER_BLOCK };
            } else {
                return { success: true, message: MESSAGES.AUTHENTICATION.USER_UNBLOCK };
            }
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Deleting a specific user
    async deleteUser<T>(userId: T): Promise<IRespone> {
        try {
            return await this.adminRepository.deleteUser(userId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //Admin login
    async login<T>(adminData: { email: string; password: string }): Promise<Record<string, any> | undefined> {
        try {
            const admin = await this.adminRepository.getAdminByEmail(adminData.email);
            if (!admin) return { success: false, message: MESSAGES.AUTHENTICATION.FAIL };
            const isPasswordValid = await comparePassword(adminData?.password, admin.password);
         
            if (isPasswordValid) {
                const adminAccessToken = generateRefreshToken(admin._id);
                return { success: true, message: MESSAGES.AUTHENTICATION.SUCCESS, admin: admin, adminAccessToken: adminAccessToken };
            } else {
                return { success: false, message: MESSAGES.AUTHENTICATION.INVALID_PASSWORD };
            }
        } catch (error) {
            console.log(error as Error);
        }
    }

    // To get all posts
    async getAllPosts(page: number, type: string,search:string): Promise<IPost[] | null | undefined> {
        try {
            const allPosts = await this.adminRepository.getAllPosts(page, type,search);
            return allPosts;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Delete a post
    async deletePost(postId: string): Promise<IRespone> {
        try {
            return await this.adminRepository.deletePostById(postId);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // blockPost
    async blockPost(postId: string): Promise<IRespone> {
        try {
            const res = await this.adminRepository.blockPost(postId);
            if (res) return { success: true, message: MESSAGES.POST.BLOCKED_SUCCESS };
            else return { success: false, message: MESSAGES.POST.BLOCKED_FAILED };
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // Get post information
    async getPostInfo(postId: string): Promise<any> {
        try {
            const result = await this.adminRepository.getPostInfo(postId as string);
            if (result) return { success: true, result: result };
            else {
                success: false;
            }
        } catch (error) {
            console.log(error as Error);
            return { success: false };
        }
    }

    // Delete comment
    async deleteComment(commentId: string):Promise<IRespone> {
        try {
            const result = await this.adminRepository.deleteComment(commentId as string);
            if (result) return { success: true, message: MESSAGES.POST.COMMENT_DELETION_SUCCESS };
            else return { success: false, message: MESSAGES.POST.COMMENT_DELETION_FAILED };
        } catch (error) {
            console.log(error as Error);
            return { success: false };
        }
    }

    // Get Dashboard
    async getDashBoardData():Promise<IDashboard|null|undefined> {
        try {
           return await this.adminRepository.getDashBoard();
        } catch (error) {
            console.log(error as Error);
           
        }
    }
    async getReports(postId:string):Promise<Record<string,any>|null|undefined> {
        try {
           return await this.adminRepository.getReports(postId);
        } catch (error) {
            console.log(error as Error);
           
        }
    }
}
