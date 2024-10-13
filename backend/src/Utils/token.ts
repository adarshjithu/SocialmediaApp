import jwt from "jsonwebtoken";

import { Types } from "mongoose";
 export const generateAccessToken = (payload:Types.ObjectId|undefined|string) => {
     const token = jwt.sign({ data: payload }, `${process.env.JWT_SECRET}`, { expiresIn: "5m" });
     return token;
};
export const generateRefreshToken = (payload:Types.ObjectId|undefined|string ) => {
     const token = jwt.sign({ data: payload }, `${process.env.JWT_SECRET}`, { expiresIn: "48h" });
     return token;
};

export const verifyToken = (token: string):any => {
     try {
          const secret = `${process.env.JWT_SECRET}`;
          const decoded = jwt.verify(token, secret);
          return decoded;
     } catch (error: any) {
          
          console.log("Error while jwt token verification");
          
          return null
     }
};

export const verifyRefreshToken = (token: string):any => {
     try {
          const secret = `${process.env.JWT_SECRET}`;
          const decoded = jwt.verify(token, secret);
          return decoded;
     } catch (error) {
          return error;
          console.log(error as Error);
     }
};






export function validateInput(input:any):any {
     // Regular expression for a valid email address
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
     // Regular expression for a valid 10-digit phone number
     const phoneRegex = /^\d{10}$/;
   
     if (emailRegex.test(input)) {
       return {email:input};
     } else if (phoneRegex.test(input)) {
       return {phonenumber:input};
     } else {
       return "Invalid input: not a valid email or 10-digit phone number";
     }
   }