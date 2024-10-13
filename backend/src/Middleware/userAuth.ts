import { NextFunction, Request, Response } from "express";
import { verifyRefreshToken, verifyToken } from "../Utils/token";
import { User } from "../Models/userModel";
import { STATUS_CODES } from "../Constants/httpStatusCodes";
const { UNAUTHORIZED } = STATUS_CODES;

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
 
    try {
        const { access_token, refresh_token } = req.cookies;

        if (!refresh_token) res.status(401).json({ message: "Refresh Token Expired" });
        const refreshTokenValid: any = verifyRefreshToken(refresh_token);

        const user = await User.findById(refreshTokenValid.data);



        if (!refreshTokenValid.data || !user) {
            res.status(UNAUTHORIZED).json({ success: false, message: "Refresh Token Expired" });
        }
        
        if (!access_token || !verifyToken(access_token)) {
            res.status(UNAUTHORIZED).json({ message: "Access Token Expired" });
        } else {
            const decoded = verifyToken(access_token);

            if (!decoded.data) {
                res.status(401).json({ success: false, message: "Access Token Expired" });
            } else {
                const user = await User.findById(decoded.data);
                req.userId = user?._id;
                req.user = user;
                next();
            }
        }
    } catch (error) {}
};
