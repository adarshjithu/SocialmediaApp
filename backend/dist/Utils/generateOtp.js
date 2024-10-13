"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    let length = 6;
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return otp;
};
exports.generateOtp = generateOtp;
