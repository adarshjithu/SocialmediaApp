import mongoose from "mongoose";


const birthdaySchema = new mongoose.Schema({birthdays:[{type:mongoose.Types.ObjectId,ref:"User"}]})
const Birthday  = mongoose.model("Birthday",birthdaySchema);
export default Birthday;