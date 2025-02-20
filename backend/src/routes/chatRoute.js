import express from "express";
import { getChat, sendChat } from "../controllers/chatController.js";

const routeChat = (io) => {
  const router = express.Router();

  router.post("/sendChat", sendChat); // Pass io to sendChat
  router.post("/getChat", getChat);

  return router;
};

export default routeChat;
