import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique : true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select : false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePic : {
    type : String,
    default : "",
  },
  role : {
    type : String,
    enum : ['user','admin'],
    default : "user"
  }
});

export default mongoose.model("user", userModel);
