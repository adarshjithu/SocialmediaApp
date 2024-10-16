
import { Vonage } from "@vonage/server-sdk";
export const sendOtpToPhone = (phonenumber: string | number, otp: string)=> {
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
         } catch (error:any ) {
              console.log("There was an error sending the messages.");
    
              return false;
         }
    }

    // Call the function
    return sendSMS();
}
