import mongoose from "mongoose";

export interface IMessage {
    senderId:mongoose.Types.ObjectId;
    receiverId:mongoose.Types.ObjectId;
    message:string;
    timestamp:string|Date
    read:boolean
    type:string;
    file:any
}

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Types.ObjectId, ref: "User" },
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type:String,
    file:{type:String,default:''}
});


export const Message =  mongoose.model('Message',messageSchema)


