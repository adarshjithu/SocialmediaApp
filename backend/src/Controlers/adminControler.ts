import { NextFunction, Request, Response } from "express";
import { AdminServices } from "../Services/adminServices";
import { STATUS_CODES } from "../Constants/httpStatusCodes";
import { createAdmin } from "../Utils/admin";
import { PostServices } from "../Services/postServices";
const { OK, UNAUTHORIZED, BAD_REQUEST } = STATUS_CODES;
export class AdminControler {
    constructor(public adminServices: AdminServices) {}

    // @desc   Getting all the user data
    // @route  Get /admin/users
    // @access Admin
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allUsers = await this.adminServices.getAllUsers(
                req.query.page ? Number(req.query.page) : 0,
                req.query.type as string,
                req.query.search as string
            );
            res.status(OK).json({ users: allUsers });
        } catch (error) {
            next(error);
        }
    }

    // @desc   To block a user
    // @route  Get admin/user/block
    // @access Admin
    async blockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.adminServices.blockUser(req?.query.userId as string);
            res.status(OK).json(result);
        } catch (error) {
            next(error);
        }
    }
    // @desc   To delete a user
    // @route  Get admin/user/delete
    // @access Admin
    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.adminServices.deleteUser(req?.query.userId as string);
            res.status(OK).json({ success: true, message: "User Deleted Successfully!" });
        } catch (error) {
            next(error);
        }
    }
    // @desc   Admin SignIn
    // @route  Get admin/login
    // @access Admin

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.adminServices.login(req.body);
            const accessTokenMaxAge = 48 * 60 * 60 * 1000;
            if (result?.success) {
                res.cookie("admin_access_token", result.adminAccessToken, {
                    maxAge: accessTokenMaxAge,
                    secure: true, 
                    httpOnly:true,
                    sameSite:"none"
                    // Prevent JavaScript access to the cookie
                   
                });
                res.status(OK).json(result);
            } else {
                res.status(UNAUTHORIZED).json(result);
            }
        } catch (error) {
            next();
        }
    }

    // @desc   Admin logout
    // @route  Get admin/logout
    // @access Admin
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.cookie("admin_access_token", "", { maxAge: 0 });
            res.status(OK).json({ success: true, message: "Admin logout successfull" });
        } catch (error) {
            next(error);
        }
    }

    // @desc   Admin get all post
    // @route  Get admin/posts
    // @access Admin
    async getAllPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allPosts = await this.adminServices.getAllPosts(
                req.query.page ? Number(req.query.page) : 0,
                req.query.type as string,
                req.query.search as string
            );
            res.status(OK).json({ posts: allPosts });
        } catch (error) {
            next(error);
        }
    }

    // @desc   Admin delete post
    // @route  Delete admin/post
    // @access Admin
    async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.adminServices.deletePost(req.query.postId as string);
            if (result) res.status(OK).json({ success: true, message: "Successfully Deleted" });
            else res.status(OK).json({ success: false, message: "Some error occured post not deleted" });
        } catch (error) {
            next(error);
        }
    }

    // @desc   Admin block post
    // @route  Delete admin/post/block
    // @access Admin
    async blockPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.adminServices.blockPost(req.query.postId as string);
            if (result?.success) res.status(OK).json(result);
            else res.status(OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    // @desc   Admin block post
    // @route  Delete admin/post/block
    // @access Admin
    async getPostInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const postData = await this.adminServices.getPostInfo(req.query.postId as string);
            if (postData?.success) res.status(OK).json(postData);
            else res.status(BAD_REQUEST).json(postData);
        } catch (error) {
            next(error);
        }
    }

    // @desc   Delete comment
    // @route  Delete admin/post/comment/delete
    // @access Admin
    async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const postData = await this.adminServices.deleteComment(req.query.commentId as string);
            if (postData?.success) res.status(OK).json(postData);
            else res.status(BAD_REQUEST).json(postData);
        } catch (error) {
            next(error);
        }
    }

    // @desc   Dashboard
    // @route  admin/dashboard
    // @access Dashboard
    async dashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
           const result  = await this.adminServices.getDashBoardData();
           if(result){
           res.status(OK).json({success:true,result:result})
           }else{res.status(BAD_REQUEST).json({success:false})}
        } catch (error) {
            next(error);
        }
    }

     // @desc   Get reports
    // @route  admin/reports
    // @access admin
    async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
         
           const result  = await this.adminServices.getReports(req.query.postId as string);
           if(result){
           res.status(OK).json({success:true,result:result})
           }else{res.status(BAD_REQUEST).json({success:false})}
      
        } catch (error) {
            next(error);
        }
    }

     // @desc   Post For sending notification to the user
    // @route  admin/reports/notification
    // @access admin
    async addNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
         
            const result =  await this.adminServices.addNotification(req.body);
            if(result){
                res.status(OK).json({success:true})
            }else{
                res.status(BAD_REQUEST).json({success:false})
            }
       console.log(req.body)
        } catch (error) {
            next(error);
        }
    }
}
