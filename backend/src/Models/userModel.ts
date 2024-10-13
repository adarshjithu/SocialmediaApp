import { timeStamp } from "console";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
     _id?: mongoose.Types.ObjectId;
     name: string;
     username: string;
     email: string;
     phonenumber: number;
     password: string;
     confirmpassword?: string;
     isOtpEmail?:boolean,
     time?:number|string;
     otp?:number|string;
     isBlocked?:boolean;
     isPrivate?:boolean;
     createdAt?:Date;
     updatedAt?:Date;
     isAdmin?:false;
     image?:string;
     success?:boolean;
     bio?:string;
     dateofbirth:Date;
     socketId?:string

}

const userSchema: Schema<IUser> = new mongoose.Schema({
     name: { type: String, required: true },
     username: { type: String,default:'' },
     bio:{type:String,default:""},
     dateofbirth:String,
     email: { type: String },
     phonenumber: Number,
     password: String,
     socketId:String,
     image:{type:String},
     isBlocked:{type:Boolean,default:false},
     isPrivate:{type:Boolean,default:false},
     isAdmin:{type:Boolean,default:false}
     
},{timestamps:true});

export const User = mongoose.model('User',userSchema);
