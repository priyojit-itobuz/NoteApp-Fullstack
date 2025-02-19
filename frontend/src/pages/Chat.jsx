import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000"); // Change to your backend URL

const Chat = ({ userId, receiverId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("userConnected", userId);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // 🔹 Fetch previous messages on first load
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/messages/${userId}/${receiverId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("sendMessage", { sender: userId, receiver: receiverId, message });
    setMessages([...messages, { sender: userId, message }]);
    setMessage("");
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid gray", padding: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.sender === userId ? "right" : "left" }}>
            {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
