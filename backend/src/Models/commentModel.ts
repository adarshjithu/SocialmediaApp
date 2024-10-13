import { Schema, model, Document, Types } from 'mongoose';

// Define an interface for the Reply
interface IReply {
  userId: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[]; // Array of user IDs who liked the reply
  createdAt?: Date;
}

// Define an interface for the Comment
export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[]; // Array of user IDs who liked the comment
  replies: IReply[];       // Array of replies to the comment
}


// Create the Comment Schema
const CommentSchema = new Schema({
  postId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 

  },
  content: { 
    type: String, 
  
  },
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  replies: [{type:Schema.Types.ObjectId,ref:"Comment"}] 
}, { timestamps: true });

// Export the Comment model
const Comment = model('Comment', CommentSchema);
export default Comment;
