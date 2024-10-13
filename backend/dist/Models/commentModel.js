"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create the Comment Schema
const CommentSchema = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
    },
    likes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    replies: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });
// Export the Comment model
const Comment = (0, mongoose_1.model)('Comment', CommentSchema);
exports.default = Comment;
