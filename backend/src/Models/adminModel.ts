import { timeStamp } from "console";
import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
     _id?: mongoose.Types.ObjectId;
     name: string;
     username: string;
     email: string;
     phonenumber: number;
     password: string;
     
}

const userSchema: Schema<IAdmin> = new mongoose.Schema({
     name: { type: String, required: true },
     username: { type: String },
     email: { type: String },
     phonenumber: Number,
     password: String,
     
},{timestamps:true});

export const Admin = mongoose.model('Admin',userSchema);
