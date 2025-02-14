import { mongoose, Schema } from "mongoose";
import user from "./userModel.js";

const chatModel = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    message: { type: String, required: true },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: user,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("chat", chatModel);
