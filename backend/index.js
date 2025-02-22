import express from "express";
import dbConnect from "./src/config/dbConnection.js";
import dotenv from "dotenv/config"; // Ensure this is at the top
import route from "./src/routes/userRoute.js";
import routes from "./src/routes/noteRoute.js";
import adminRoute from './src/routes/adminRoute.js';
import routeChat from './src/routes/chatRoute.js' 
import fs from "fs";
import cors from "cors";
import { Server } from 'socket.io';
import http from 'http';


const corsOptions = {
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set

const dir = "./uploads";
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

app.use("/", route);
app.use("/note", routes);
app.use('/admin', adminRoute);


// Serve static files
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods : ["GET","POST"],
    },
});


// WebSocket Connection
io.on("connection", (socket) => {
  console.log(`User  Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User  with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
      console.log("Received msg", data);
      io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
      console.log("User  Disconnected", socket.id);
  });
});

// Pass io to the chat routes
app.use("/chat", routeChat(io));




server.listen(PORT, () => {
    console.log(`Server up at ${PORT}`);
});

dbConnect();

// import express from "express";
// import dbConnect from "./src/config/dbConnection.js";
// import dotenv from "dotenv/config";
// import route from "./src/routes/userRoute.js";
// import routes from "./src/routes/noteRoute.js";
// import adminRoute from './src/routes/adminRoute.js'
// import fs from "fs";
// import cors from "cors";
// import Message from '../backend/src/models/chatModel.js'
// import {Server} from 'socket.io'
// import http from 'http'
// import { isLoggedIn } from "./src/middlewares/loginStatus.js";

// const corsOptions ={
//     origin:'*', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200,
// }


// const app = express();
// app.use(cors(corsOptions));
// app.use(express.json());

// const PORT = process.env.PORT;

// const dir = "./uploads";
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir);
// }

// app.use("/", route);
// app.use("/note", routes);
// app.use('/admin',adminRoute)

// // to use static files (uploads is my folder which has static files)
// app.use("/uploads", express.static("uploads"));


// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// // Store connected users
// const onlineUsers = new Map();

// // WebSocket connection
// io.on("connection", (socket) => {
//   console.log("New user connected:", socket.id);

//   socket.on("userConnected", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log("User Online:", userId);
//   });

//   // Handle messages
//   socket.on("sendMessage", async ({ sender, receiver, message }) => {
//     try {
//       const newMessage = await Message.create({ sender, receiver, message });

//       const receiverSocketId = onlineUsers.get(receiver);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("receiveMessage", newMessage);
//       }
//       socket.emit("messageSent", newMessage);
//     } catch (error) {
//       console.error("Message send error:", error);
//     }
//   });

//   // Handle user disconnect
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     for (let [key, value] of onlineUsers.entries()) {
//       if (value === socket.id) {
//         onlineUsers.delete(key);
//         break;
//       }
//     }
//   });
// });



// const getMessage = async(req,res) => {
//   try {
//     // const { receiverId } = req.params.body;
//     // const {userId} = req.params;
//     const {userId,receiverId} = req.body;
//     const messages = await Message.find({
//       $or: [
//         { sender: userId, receiver: receiverId },
//         { sender: receiverId, receiver: userId },
//       ],
//     }).sort({ createdAt: 1 });

//     res.status(200).json({
//       success : true,
//       messages,receiverId
//     })
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// app.get("/api/messages/:userId",isLoggedIn,getMessage);

// app.listen(PORT, () => {
//   console.log(`Server up at ${PORT}`);
// });

// dbConnect();

