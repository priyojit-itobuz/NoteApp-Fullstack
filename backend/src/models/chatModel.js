import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  Sender: {
    type: String,
    required: true
  },
  Receiver: {
    type: String,
    required: true
  },
  userId_Sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  userId_Receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  message:{
    type:String,
    required:true,
  },
},{
  timestamps:true
})

export default mongoose.model("chat", ChatSchema)