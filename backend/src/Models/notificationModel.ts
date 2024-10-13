import mongoose from "mongoose";

export interface INotification {
    _id?: mongoose.Types.ObjectId;
    userId?: any;
    viwed?: boolean;
    notifications?: [{ message: string; userId: mongoose.Types.ObjectId,createdAt:Date,isViewed:boolean,postId:mongoose.Types.ObjectId,
        image:string,data?:string
     }];
}

const notificationSchema = new mongoose.Schema<INotification>({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    notifications: [
        {
            message: { type: String },
            userId: { type: mongoose.Types.ObjectId, ref: "User" },
            createdAt: { type: Date},
            isViewed: { type: Boolean, default: false },
            postId:{type:mongoose.Types.ObjectId,ref:"Post"},
            image:String,
            data:String
        },
    ],
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
