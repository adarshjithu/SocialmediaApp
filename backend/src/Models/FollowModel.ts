import mongoose, { Schema, Types } from "mongoose";

export interface IFollow extends Document {
   userId: Types.ObjectId;
   followers: Types.ObjectId[];
   following: Types.ObjectId[];
   requests: Types.ObjectId[];
}

const followSchema = new mongoose.Schema<IFollow>({
   userId: { type: Schema.Types.ObjectId, ref: "User" },
   followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
   following: [{ type: Schema.Types.ObjectId, ref: "User" }],
   requests: [{ userId:{type: Schema.Types.ObjectId,ref: "User" },requestedAt:{type:Date,default:new Date()} }],
});

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
