import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "../Constants/httpStatusCodes";

import { PostServices } from "../Services/postServices";

import { uploadVideoToCloudinary } from "../Utils/uploadVideosToCloudinary";
import { json } from "stream/consumers";
const { OK, BAD_REQUEST, UNAUTHORIZED, CONFLICT } = STATUS_CODES;

export class PostControlers {
    constructor(public postServices: PostServices) {}

    // @desc   ForUploading images to cloudinary
    // @route  POST /image/upload
    // @access Private
    async uploadImage(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.userId;
            const description = req.body.description;
            const result = await this.postServices.uploadImage(req.files, user, description);
            if (result?.success) {
                res.status(OK).json(result);
            } else {
                res.status(BAD_REQUEST).json(result);
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   For getting all the post for a specific user
    // @route  POST /image/upload
    // @access Private
    async getAllPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allPost = await this.postServices.getAllPosts(req.userId);
            if (allPost) {
                res.status(OK).json(allPost);
            } else {
                res.status(BAD_REQUEST).json(allPost);
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   For uploading video to user
    // @route  POST /video/upload
    // @access Private
    async uploadVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result: any = await uploadVideoToCloudinary(req.file);

            if (result?.success) {
                const successResult = await this.postServices.createVideoPost(result?.videoUrl, req.body.description, req.userId);

                if (successResult.success) res.status(OK).json(successResult);
                else res.status(BAD_REQUEST).json(successResult);
            } else {
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Like post for user
    // @route  POST post/like
    // @access Private
    async likePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.likePost(req.query.postId as string, req.userId);
            if (result.success) res.status(OK).json(result);
            else res.status(BAD_REQUEST).json(json);
        } catch (error) {
            next(error);
        }
    }

    // @desc   Unlike post for user
    // @route  POST post/unlike
    // @access Private
    async unlikePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.unlikePost(req.query.postId as string, req.userId);
            if (result.success) res.status(OK).json(result);
            else res.status(BAD_REQUEST).json(json);
        } catch (error) {
            next(error);
        }
    }

    // @desc   Comment post
    // @route  POST post/comment
    // @access Private
    async commentPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.commentPost(req.body.postId, req.body.comment, req.userId);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   Get all comments for a specific user
    // @route  GET post/comments
    // @access Private
    async getAllComments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.getAllComments(req.query.postId as string, req.userId);

            if (result?.success) res.status(OK).json(result);
            else res.status(BAD_REQUEST).json(result);
        } catch (error) {
            next(error);
        }
    }

    // @desc   To like a comment
    // @route  GET post/comment/like
    // @access Private
    async likeComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.likeComment(req.query.commentId as string, req.userId);
            if (result?.success) res.status(OK).json({ success: true });
            else res.status(BAD_REQUEST).json(result);
        } catch (error) {
            next(error);
        }
    }

    // @desc   To unlike a comment
    // @route  GET post/comment/unlike
    // @access Private
    async unlikeComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.unlikeComment(req.query.commentId as string, req.userId);
            if (result?.success) res.status(OK).json({ success: true });
            else res.status(BAD_REQUEST).json(result);
        } catch (error) {
            next(error);
        }
    }

    // @desc  To reply for a comment
    // @route  POST post/comment/reply
    // @access Private
    async replyComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.replyComment(req.body.text, req.body.commentId, req.userId);
            if (result) res.status(OK).json(result);
            else res.status(BAD_REQUEST).json(result);
        } catch (error) {
            next(error);
        }
    }
    // @desc  Post feeling
    // @route  POST post/feeling
    // @access Private
    async postFeeling(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.postFeeling(req.body.text, req.userId);
            if (result?.success) res.status(OK).json(result);
            else {
                res.status(BAD_REQUEST).json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   ForUploading story images to cloudinary
    // @route  POST /image/upload
    // @access Private
    async uploadStory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.userId;

            const result = await this.postServices.uploadStoryImage(req.files, req.userId);
            if (result?.success) {
                res.status(OK).json(result);
            } else {
                res.status(BAD_REQUEST).json(result);
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   Getting all the stories of user
    // @route  POST /post/story
    // @access Private
    async getAllStories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.getAllStories(req.userId);
            if (result) res.status(OK).json(result);
            else res.status(BAD_REQUEST).json(result);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   Getting all the stories of user
    // @route  POST /post/story
    // @access Private
    async likeStory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.likeStory(req.body.storyId as string, req.body.expiresAt, req.userId);
            // if(result.success) res.status(OK).json({success:true})
            //      else res.status(BAD_REQUEST).json({success:false})
            // res.json({success:true})
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   Getting all the stories of user
    // @route  POST /post/story
    // @access Private
    async getReply(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.getReply(req.query.replyId as string, req.userId);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   To get postdata
    // @route  POST /post/post
    // @access Private
    async getPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.getPost(req.query.postId as string, req.userId);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   To get postdata
    // @route  POST /post/post
    // @access Private
    async getUsersForShare(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.getUsersForShare(req.userId);
            if (result) {
                res.status(OK).json({ success: true, result: result });
            } else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   To Like replied comment
    // @route  POST /post/comment/reply/like
    // @access Private
    async likeRepliedComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.likeRepliedComment(req.userId, req.body.commentId, req.body.type);
            if (result) {
                res.status(OK).json({ success: true });
            } else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   To Reply Replied comment
    // @route  POST /post/comment/reply/reply
    // @access Private
    async replyRepliedComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postServices.replyRepliedComment(req.body.text, req.body.commentId, req.userId);
            if (result) {
                res.status(OK).json(result);
            } else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // @desc   To report post
    // @route  POST /post/report
    // @access Private
    async reportPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const result =  await this.postServices.reportPost(req.userId,req.body.postId,req.body.reason);
          if(result) {res.status(OK).json({success:true,message:"Successfully Reported"})}
          else{res.status(BAD_REQUEST).json({success:false,message:'Error while reporting'})}
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}
