

import React, { useContext, useState, useEffect } from 'react';
import io from "socket.io-client";
import ChatRoom from '../components/ChatRoom';
import { CreateContext } from '../context/myContext';

const socket = io("http://localhost:3000"); // Change to your backend URL

export default function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const { uId, adminId, Role } = useContext(CreateContext);

  useEffect(() => {
    const initialRoomValue = Role === 'user' ? adminId : uId;
    setRoom(initialRoomValue);
  }, [adminId, uId, Role]);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            value={room} // Use value instead of defaultValue
            readOnly // Make it read-only if you don't want users to change it
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <ChatRoom socket={socket} username={username} room={room} />
      )}
    </div>
  );
}