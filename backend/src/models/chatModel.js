import { mongoose, Schema } from "mongoose";
import user from "./userModel.js";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: user, required: true },
    receiver: { type: Schema.Types.ObjectId, ref: user , required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);

