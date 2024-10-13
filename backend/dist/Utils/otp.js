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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = exports.generateOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const server_sdk_1 = require("@vonage/server-sdk");
//function for generating otp
const generateOtp = () => {
    const length = 6;
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return otp;
};
exports.generateOtp = generateOtp;
//function for sending otp to email
const sendOtp = (userData, otp) => {
    if (userData.isOtpEmail || (userData.isForForget && userData.email)) {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail", // Use your email service provider
            auth: {
                user: process.env.TRANSPORTER_EMAIL,
                pass: process.env.TRANSPORTER_PASSWORD,
            },
        });
        const mailOptions = {
            from: "adarshjithu10@gmail.com",
            to: userData.email,
            subject: "OTP Verification",
            text: `Welcome to Friendzy, Your Otp for registration is :${otp}`,
        };
        const sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield transporter.sendMail(mailOptions);
                console.log("Mail Send to ", mailOptions.to);
                //if otp success return true;
                return true;
            }
            catch (error) {
                console.error("Error sending email:", error);
                //if otp fails return false;
                return false;
            }
        });
        return sendEmail(mailOptions);
    }
    else {
        //if otp is sending to mobilenumber call this function
        if (!userData.phonenumber) {
            return false;
        }
        return sendOtpToPhone(userData.phonenumber, otp);
    }
};
exports.sendOtp = sendOtp;
//function for sending otp to phonenumber
function sendOtpToPhone(phonenumber, otp) {
    // Initialize the Vonage SDK with your credentials
    const vonage = new server_sdk_1.Vonage({
        apiKey: "a949ba7d",
        apiSecret: "COOYuBnsrq56nEIo",
    });
    const from = "Friendzy";
    const to = `91${phonenumber}`;
    const text = `Welcome to Friendzy, Your Otp for registration is :${otp}`;
    // Define the async function to send SMS
    function sendSMS() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Correct usage based on documentation
                const response = yield vonage.sms.send({ to, from, text });
                console.log("Message sent successfully");
                console.log(response);
                return true;
            }
            catch (error) {
                console.log("There was an error sending the messages.");
                console.error(error);
                return false;
            }
        });
    }
    // Call the function
    return sendSMS();
}
