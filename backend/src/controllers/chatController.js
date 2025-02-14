import statusCodes from "../config/constants.js";
import chat from '../models/chatModel.js';

export const getMessages = async (req,res) => {
    try {
        const messages = await chat.find();
        return res.status(statusCodes.OK).json({
            success : true,
            message: "Chats Found",
            messages
        })
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : error.message
        })       
    }
}

export const sendMessage = async(req,res) => {
    try {
        const userId = req.body.userId
        const { message } = req.body;
        if (!userId || !message) {
			return res.status(statusCodes.FORBIDDEN).json({
                success : false,
                message : "Message and User is required"
            })
		}

        const chatMessage = new chat({
			userId,
			message,
		});

		await chatMessage.save();
        return res.status(statusCodes.CREATED).json({
            success : true,
            message : "Chat send",
            chatMessage
        })
    } catch (error) {
        return res.sat
    }
}