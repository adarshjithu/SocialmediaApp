import { NextFunction, Request, Response } from "express";
import { ChatServices } from "../Services/chatServices";
import { STATUS_CODES } from "../Constants/httpStatusCodes";
import { uploadImageToCloudinary } from "../Utils/upload";
import cloudinary from "../Utils/cloudinary";
const { OK, BAD_REQUEST, UNAUTHORIZED, CONFLICT } = STATUS_CODES;

export class ChatControler {
    constructor(public chatServices: ChatServices) {}

    // @desc   To get all the messages
    // @route  GET /chat/messages
    // @access Private
    async getAllMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.chatServices.getAllMessages(req.query.senderId as string, req.query.receiverId as string);
            if (result) {
                res.status(200).json({ success: true, result: result });
            } else {
                res.status(BAD_REQUEST).json({ success: false });
            }
        } catch (error) {
            next(error);
        }
    }

    // @desc   To get all the users
    // @route  GET /chat/users
    // @access Private
    async getAllChatedUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.chatServices.getAllUsers(req.userId);
            if (result) res.status(OK).json({ success: true, result: result });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc   Search users
    // @route  GET /chat/users/search
    // @access Private
    async searchUserForChat(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.chatServices.searchUser(req.query.query as string, req.userId);
            if (result) res.status(OK).json({ success: true, result: result });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc   Send feedback
    // @route  GET /chat/feedback
    // @access Private
    async sendFeedBack(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.chatServices.sendFeedBack(req.body.feedback as string, req.userId);
            if (result) res.status(OK).json({ success: true, message: "Feedback has been successfully submited" });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc  Get  feedback
    // @route  GET /chat/feedback
    // @access Private
    async getFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.chatServices.getFeedback(req.query.page as string);
            if (result) res.status(OK).json({ success: true, result: result });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc To get all the activer frineds
    // @route  GET /chat/active-friends
    // @access Private
    async activeFriends(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.chatServices.getAllActiveFriends(req.body.friends, req.userId);
            if (result) res.status(OK).json({ success: true, result: result });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc To get all the activer frineds
    // @route  DELETE /chat/clear
    // @access Private
    async clearAllChat(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.chatServices.clearAllChat(req.query.senderId as string, req.query.receiverId as string);
            if (result) res.status(OK).json({ success: true });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc To send image to friends
    // @route  POST /chat/image
    // @access Private
    async sendImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await uploadImageToCloudinary(req.files);
            const images = result?.results?.map((obj: any) => obj.url);

            if (result && images) res.status(OK).json({ success: true, image: images[0] });
            else res.status(BAD_REQUEST).json({ success: false });
        } catch (error) {
            next(error);
        }
    }

    // @desc Upload audio
    // @route  POST /chat/audio
    // @access Private
    async uploadAudio(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            // Create a Cloudinary upload stream
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "raw" }, // Specify 'raw' for audio
                (error, result) => {
                    if (error) {
                        return res.status(400).json({ error: "Audio upload failed" });
                    }

                    // Respond with the secure URL of the uploaded audio
                    res.status(200).json({ success: true, url: result?.secure_url });
                }
            );

            // Check if req.file and req.file.stream exist
            if (req?.file?.buffer) {
                // If the file is uploaded to memory, use the buffer
                uploadStream.end(req.file.buffer);
            } else if (req?.file?.stream) {
                // If the file is uploaded as a stream, pipe it to Cloudinary
                req.file.stream.pipe(uploadStream);
            } else {
                return res.status(400).json({ error: "No file provided" });
            }
        } catch (error) {
            next(error);
        }
    }
}
