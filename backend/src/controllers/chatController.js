import user from "../models/userModel.js";
import chatSchema from "../models/chatModel.js";
import statusCodes from "../config/constants.js";

// one to one-chat posting (through id)
export const sendChat = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const sender = await user.findById(senderId);
    const receiver = await user.findById(receiverId);
    const data = await chatSchema.create({
      Sender: sender.userName,
      Receiver: receiver.userName,
      message: message,
      userId_Sender: senderId,
      userId_Receiver: receiverId,
    });
    if (data) {
      return res.status(statusCodes.CREATED).json({
        success: true,
        message: "Message stored successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error,
    });
  }
};



//one to one chat retrieval through id
export const getChat = async (req, res) => {
  try {
    console.log(req.body);
    const { senderId, receiverId } = req.body;
    const user = await chatSchema.find({
      $or: [
        { userId_Sender: senderId, userId_Receiver: receiverId },
        { userId_Sender: receiverId, userId_Receiver: senderId },
      ],
    });
    if (user) {
      return res.status(statusCodes.OK).json({
        success: true,
        data: user,
        message: "Chats Fetched Successfully",
      });
    }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
