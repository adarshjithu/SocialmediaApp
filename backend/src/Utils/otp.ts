import nodemailer from "nodemailer";
import { Vonage } from "@vonage/server-sdk";

//function for generating otp
export const generateOtp = () => {
     const length = 6;
     const digits = "0123456789";
     let otp = "";
     for (let i = 0; i < length; i++) {
          otp += digits.charAt(Math.floor(Math.random() * digits.length));
     }
     return otp;
};

//function for sending otp to email
export const sendOtp = (userData: Record<string, any>, otp: string) => {
     if (userData.isOtpEmail || (userData.isForForget && userData.email)) {
          const transporter = nodemailer.createTransport({
               service: "gmail", // Use your email service provider
               auth: {
                    user: process.env.TRANSPORTER_EMAIL,
                    pass: process.env.TRANSPORTER_PASSWORD,
               },
          });
//interface for mail options 
          interface MailOptions {
               from: string;
               to: string;
               subject: string;
               text?: string;
               html?: string;
          }
          const mailOptions = {
               from: "adarshjithu10@gmail.com",
               to: userData.email,
               subject: "OTP Verification",
               text: `Welcome to Friendzy, Your Otp for registration is :${otp}`,
          };
      

          const sendEmail = async (mailOptions: MailOptions): Promise<boolean> => {
               try {
                     await transporter.sendMail(mailOptions);

                    console.log("Mail Send to ", mailOptions.to);
                    //if otp success return true;
                    return true;
               } catch (error) {
                    console.error("Error sending email:", error);
                    //if otp fails return false;
                    return false;
                    
               }
          };
          return sendEmail(mailOptions);

     } else {
          //if otp is sending to mobilenumber call this function
          if(!userData.phonenumber){
               return false;
          }
          return sendOtpToPhone(userData.phonenumber, otp);
     }
};

//function for sending otp to phonenumber
function sendOtpToPhone(phonenumber: string | number, otp: string) {
     // Initialize the Vonage SDK with your credentials
     const vonage = new Vonage({
          apiKey: "a949ba7d",
          apiSecret: "COOYuBnsrq56nEIo",
     });

     const from = "Friendzy";
     const to = `91${phonenumber}`;
     const text = `Welcome to Friendzy, Your Otp for registration is :${otp}`;

     // Define the async function to send SMS
     async function sendSMS() {
          try {
               // Correct usage based on documentation
               const response = await vonage.sms.send({ to, from, text });
               console.log("Message sent successfully");
               console.log(response);
               return true;
          } catch (error) {
               console.log("There was an error sending the messages.");
               console.error(error);
               return false;
          }
     }

     // Call the function
     return sendSMS();
}
