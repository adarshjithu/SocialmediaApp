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
exports.adminAuth = void 0;
const token_1 = require("../Utils/token");
const adminModel_1 = require("../Models/adminModel");
const httpStatusCodes_1 = require("../Constants/httpStatusCodes");
const { UNAUTHORIZED } = httpStatusCodes_1.STATUS_CODES;
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin_access_token = req.cookies.admin_access_token;
        if (!admin_access_token) {
            res.status(401).json({ success: false, message: "Admin Credentials Invalid please SignIn" });
        }
        else {
            const decoded = (0, token_1.verifyRefreshToken)(admin_access_token);
            if (decoded.data) {
                const admin = yield adminModel_1.Admin.findOne({ _id: decoded.data });
                if (!admin) {
                    res.status(UNAUTHORIZED).json({ success: true, message: "Admin Credentials Invalid please SignIn" });
                }
                else {
                    next();
                }
            }
            else {
                res.status(UNAUTHORIZED).json({ success: 'false', message: "Admin Credentials Invalid please SignIn" });
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.adminAuth = adminAuth;
