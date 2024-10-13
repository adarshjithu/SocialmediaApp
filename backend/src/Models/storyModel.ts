import mongoose, { Document, Schema, Types } from "mongoose";

// Interface for the Story document
export interface IStory extends Document {
     userId: Types.ObjectId;
     contentType?: string;
     image?: string;
     video?: string;
     expiresAt?: Date;
     isLiked?:boolean // Field to track when the story should expire
}

export interface IUserStory extends Document {
     userId: Types.ObjectId;
     stories: IStory[];
}

const storySchema = new mongoose.Schema<IUserStory>(
     {
          userId: { type: Schema.Types.ObjectId, ref: "User" },
          stories: [
               {
                    contentType: { type: String },
                    image: { type: String },
                    video: { type: String },
                    likes:[{type:Schema.Types.ObjectId,ref:'User'}],
                    expiresAt: { type: Date, required: true, index: { expires: "1d" } },
               },
          ],
     },
     {
          timestamps: true,
     }
);

const Story = mongoose.model<IUserStory>("Story", storySchema);
export default Story;
