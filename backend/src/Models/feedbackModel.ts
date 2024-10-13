import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "User" },
        feedback: String,
    },
    { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
