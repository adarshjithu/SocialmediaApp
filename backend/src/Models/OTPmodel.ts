import mongoose from "mongoose";

// Create a schema with a Mixed type field
const tempOtpSchema = new mongoose.Schema({
    userData: {
        type: mongoose.Schema.Types.Mixed,
        required: true, // If you want to enforce that this field must be present
    },
    createdAt: {
        type: Date,
        default: Date.now, // Optional: Automatically set the creation date
        expires: '1h', // Optional: Automatically delete documents after 1 hour
    },
});

const TempOTP = mongoose.model("TempOTP", tempOtpSchema);

export default TempOTP;
