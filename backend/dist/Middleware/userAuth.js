"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../Utils/token");
const userModel_1 = require("../Models/userModel");
const httpStatusCodes_1 = require("../Constants/httpStatusCodes");
const { UNAUTHORIZED } = httpStatusCodes_1.STATUS_CODES;
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { access_token, refresh_token } = req.cookies;
        if (!refresh_token)
            res.status(401).json({ message: "Refresh Token Expired" });
        const refreshTokenValid = (0, token_1.verifyRefreshToken)(refresh_token);
        const user = yield userModel_1.User.findById(refreshTokenValid.data);
        if (!refreshTokenValid.data || !user) {
            res.status(UNAUTHORIZED).json({ success: false, message: "Refresh Token Expired" });
        }
        if (!access_token || !(0, token_1.verifyToken)(access_token)) {
            res.status(UNAUTHORIZED).json({ message: "Access Token Expired" });
        }
        else {
            const decoded = (0, token_1.verifyToken)(access_token);
            if (!decoded.data) {
                res.status(401).json({ success: false, message: "Access Token Expired" });
            }
            else {
                const user = yield userModel_1.User.findById(decoded.data);
                req.userId = user === null || user === void 0 ? void 0 : user._id;
                req.user = user;
                next();
            }
        }
    }
    catch (error) { }
});
exports.authenticate = authenticate;
