import 'express-session';

declare module 'express-session' {
    interface SessionData {
        userData?: {
            name?: string;
            email?: string;
            phoneNumber?: string;
            password?:string;
            time?:number|string;
            otp?:number|string;
            // Add other fields as needed
        }|null;
        forgetData?:{
            success?:boolean;
            forgetotp?:string;
            user?:any;
            time?:number|string
        }
    }


}
