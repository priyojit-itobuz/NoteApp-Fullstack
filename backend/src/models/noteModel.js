import { mongoose, Schema } from "mongoose";
import user from "./userModel.js";

const noteModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  pic : {
    type : String,
    default : "",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: user,
    required : true
  }
});

export default mongoose.model("note", noteModel);
