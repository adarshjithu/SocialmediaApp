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
exports.sendOtpToPhone = void 0;
const server_sdk_1 = require("@vonage/server-sdk");
const sendOtpToPhone = (phonenumber, otp) => {
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
                return false;
            }
        });
    }
    // Call the function
    return sendSMS();
};
exports.sendOtpToPhone = sendOtpToPhone;
