import { mongoose, Schema } from "mongoose";
import user from "./userModel.js";

const sessionModel = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: user,
    required : true
  }
},{ timestamps: true });

export default mongoose.model("session", sessionModel);
