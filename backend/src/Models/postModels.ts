import { timeStamp } from "console";
import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
     _id?: mongoose.Types.ObjectId;
     user?: mongoose.Schema.Types.ObjectId;
     likes?: mongoose.Schema.Types.ObjectId[];
     comments?: mongoose.Schema.Types.ObjectId[];
     description?: string;
     private?: boolean;
     isBlocked?: boolean;
     contentType?: string;
     images?: string[];
     video?: string;
     reported?:any
}
const reportSchema: Schema = new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to a user
     reason: { type: String, required: true },
     createdAt:Date // Reason for the report
   });
const postSchema: Schema<IPost> = new mongoose.Schema(
     {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User",default:[] },
          likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", }],
          comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments", default:[]}],
          description: String,
          private: { type: Boolean, default: false },
          isBlocked: { type: Boolean, default: false },
          contentType: String,
          images: Array,
          video: String,
          reported:[reportSchema]
     },
     { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
