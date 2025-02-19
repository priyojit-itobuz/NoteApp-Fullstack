import express from "express";
import dbConnect from "./src/config/dbConnection.js";
import dotenv from "dotenv/config";
import route from "./src/routes/userRoute.js";
import routes from "./src/routes/noteRoute.js";
import adminRoute from './src/routes/adminRoute.js'
import fs from "fs";
import cors from "cors";
import Message from '../backend/src/models/chatModel.js'
import {Server} from 'socket.io'
import http from 'http'

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}


const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT;

const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.use("/", route);
app.use("/note", routes);
app.use('/admin',adminRoute)

// to use static files (uploads is my folder which has static files)
app.use("/uploads", express.static("uploads"));


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store connected users
const onlineUsers = new Map();

// WebSocket connection
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("userConnected", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User Online:", userId);
  });

  // Handle messages
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      const newMessage = await Message.create({ sender, receiver, message });

      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      }
      socket.emit("messageSent", newMessage);
    } catch (error) {
      console.error("Message send error:", error);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
  });
});


app.get("/api/messages/:userId/:receiverId", async (req, res) => {
  try {
    const { userId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server up at ${PORT}`);
});

dbConnect();
