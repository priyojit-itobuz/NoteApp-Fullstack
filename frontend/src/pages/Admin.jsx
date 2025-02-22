// import React, { useContext, useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
// import axiosInstance from '../utils/axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import { MdDelete, MdAddCircle } from "react-icons/md";
// import { toast } from 'react-toastify';
// import { CreateContext } from '../context/myContext';
// // import { IoChatbubbleEllipsesOutline, IoSend } from "react-icons/io5";
// import { IoChatbubbleEllipsesOutline, IoSendOutline } from "react-icons/io5";
// import { Modal } from "flowbite-react";
// import axios from 'axios';
// import { io } from 'socket.io-client';

// const socket = io("http://localhost:3000"); // Adjust the URL as necessary

// export default function Admin() {
//     const [users, setUsers] = useState([]);
//     const { uId, setuId, adminId } = useContext(CreateContext);
//     const [openModal, setOpenModal] = useState(false);
//     const [user, setUser ] = useState({});
//     const [messages, setMessages] = useState([]);
//     const [messageInput, setMessageInput] = useState("");

//     const navigate = useNavigate();

//     useEffect(() => {
//         getUsers();
//         socket.on("receiveMessage", (data) => {
//             setMessages((prevMessages) => [
//                 ...prevMessages,
//                 { userId_Sender: data.senderId, message: data.message },
//             ]);
//         });

//         return () => {
//             socket.off("receiveMessage");
//         };
//     }, []);

//     async function getUsers() {
//         try {
//             const res = await axiosInstance.get("/admin/allUser");
//             if (res.data.success) {
//                 setUsers(res.data.data);
//                 socket.emit("join_room", adminId);
//             }
//         } catch (error) {
//             console.error(error.response?.data?.message || error.message);
//         }
//     }

//     async function handleUserDelete(id) {
//         try {
//             const res = await axiosInstance.delete(`/admin/deleteUser/${id}`);
//             if (res.data.success) {
//                 toast.success("User  deleted successfully.");
//                 getUsers();
//             } else {
//                 toast.error("Failed to delete user.");
//             }
//         } catch (error) {
//             console.error("Error deleting user:", error.message);
//         }
//     }


//     const toggleModal = async (user) => {
//         if (!openModal) {
//             setUser(user);  // ✅ Set the selected user before fetching messages
//             try {
//                 const res = await axios.post("http://localhost:3000/chat/getChat", {
//                     senderId: adminId,
//                     receiverId: user._id,
//                 });
//                 if (res.data.success) {
//                     setMessages(res.data.data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching chat:", error.message);
//             }
//         }
//         setOpenModal(!openModal);
//     };
    
//     const sendMessage = async () => {
//         if (!messageInput.trim()) return;

//         const newMessage = {
//             senderId: adminId,
//             receiverId: user._id,
//             message: messageInput.trim(),
//         };
//         socket.emit("sendMessage",newMessage)

//         try {
//             await axios.post("http://localhost:3000/chat/sendChat", newMessage);
//             setMessages((prevMessages) => [
//                 ...prevMessages,
//                 { userId_Sender: adminId, message: messageInput.trim() },
//             ]);
//             setMessageInput("");
//         } catch (error) {
//             console.error("Error sending message:", error.message);
//         }
//     };

//     return (
//         <div>
//             <Navbar />
//             <h1 className='text-2xl mt-5 font-bold'>All Users</h1>
//             <div className="mt-5 relative overflow-x-auto shadow-md sm:rounded-lg">
//                 <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//                     <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                         <tr>
//                             <th className="px-6 py-3 text-center">User  Name</th>
//                             <th className="px-6 py-3 text-center">Email</th>
//                             <th className="px-6 py-3 text-center">Add Notes</th>
//                             <th className="px-6 py-3 text-center">Start Chat</th>
//                             <th className="px-6 py-3 text-center">Delete User</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user, index) => (
//                             <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
//                                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
//                                     {user.userName}
//                                 </td>
//                                 <td className="px-6 py-4 text-center">{user.email}</td>
//                                 <td className="px-6 py-4 text-center">
//                                     <button onClick={() => { setuId(user._id); navigate("/addNote"); }}>
//                                         <MdAddCircle size={25} />
//                                     </button>
//                                 </td>
//                                 <td className="px-6 py-4 text-center">
//                                     <IoChatbubbleEllipsesOutline size={25} className="cursor-pointer mx-auto" onClick={() => toggleModal(user)} />
//                                 </td>
//                                 <td className="px-6 py-4 text-center">
//                                     <button onClick={() => handleUserDelete(user._id)}>
//                                         <MdDelete color='red' size={25} className="mx-auto" />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {openModal && (
//                 <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
//                     <Modal.Header>Chat With {user.userName}</Modal.Header>
//                     <Modal.Body>
//                         <div className="space-y-6">
//                             <div className="p-4 overflow-y-auto space-y-3 max-h-[350px]">
//                                 {messages.map((msg, index) => (
//                                     <div
//                                         key={index}
//                                         className={`p-2 rounded-lg max-w-[70%] ${msg.userId_Sender === adminId
//                                             ? "bg-green-100 self-end ml-auto text-right"
//                                             : "bg-blue-100 self-start text-left"
//                                             }`}
//                                     >
//                                         {msg.message}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <div className="p-4 flex mx-auto justify-center space-x-2 w-full">
//                             <input
//                                 type="text"
//                                 placeholder="Type a message..."
//                                 className="w-full p-2 border rounded-lg"
//                                 value={messageInput}
//                                 onChange={(e) => setMessageInput(e.target.value)}
//                             />
//                             <button
//                                 className="p-2 bg-blue-500 text-white rounded-full"
//                                 onClick={sendMessage}
//                             >
//                                 {/* <IoSend size={24} /> */}
//                                 <IoSendOutline size={24} />
//                             </button>
//                         </div>
//                     </Modal.Footer>
//                 </Modal>
//             )}
//         </div>
//     );
// }

import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdAddCircle } from "react-icons/md";
import { toast } from 'react-toastify';
import { CreateContext } from '../context/myContext';
import { IoChatbubbleEllipsesOutline, IoSendOutline } from "react-icons/io5";
import { Modal } from "flowbite-react";
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000"); // Adjust as necessary

export default function Admin() {
    const [users, setUsers] = useState([]);
    const { uId, setuId, adminId } = useContext(CreateContext);
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getUsers();

        socket.on("receiveMessage", (data) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { userId_Sender: data.senderId, message: data.message },
            ]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    async function getUsers() {
        try {
            const res = await axiosInstance.get("/admin/allUser");
            if (res.data.success) {
                setUsers(res.data.data);
                socket.emit("join_room", adminId);
            }
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    }

    async function handleUserDelete(id) {
        try {
            const res = await axiosInstance.delete(`/admin/deleteUser/${id}`);
            if (res.data.success) {
                toast.success("User deleted successfully.");
                getUsers();
            } else {
                toast.error("Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error.message);
        }
    }

    const toggleModal = async (selectedUser) => {
        if (!openModal) {
            setUser(selectedUser);
            try {
                const res = await axios.post("http://localhost:3000/chat/getChat", {
                    senderId: adminId,
                    receiverId: selectedUser._id,
                });
                if (res.data.success) {
                    setMessages(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching chat:", error.message);
            }
        }
        setOpenModal(!openModal);
    };

    // const sendMessage = async () => {
    //     if (!messageInput.trim()) return;

    //     const newMessage = {
    //         senderId: adminId,
    //         receiverId: user._id,
    //         message: messageInput.trim(),
    //     };
    //     socket.emit("sendMessage", newMessage);

    //     try {
    //         await axios.post("http://localhost:3000/chat/sendChat", newMessage);
    //         setMessages((prevMessages) => [
    //             ...prevMessages,
    //             { userId_Sender: adminId, message: messageInput.trim() },
    //         ]);
    //         setMessageInput("");
    //     } catch (error) {
    //         console.error("Error sending message:", error.message);
    //     }
    // };

    const sendMessage = async () => {
        if (!messageInput.trim()) return;
    
        const newMessage = {
            senderId: adminId,
            receiverId: user._id,
            message: messageInput.trim(),
        };
    
        // Emit the message to the server
        socket.emit("sendMessage", newMessage);
    
        // Update the messages state immediately
        setMessages((prevMessages) => [
            ...prevMessages,
            { userId_Sender: adminId, message: messageInput.trim() },
        ]);
    
        try {
            await axios.post("http://localhost:3000/chat/sendChat", newMessage);
            setMessageInput("");
        } catch (error) {
            console.error("Error sending message:", error.message);
        }
    };
    
    return (
        <div>
            <Navbar />
            <h1 className='text-2xl mt-5 font-bold'>All Users</h1>
            <div className="mt-5 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3 text-center">User Name</th>
                            <th className="px-6 py-3 text-center">Email</th>
                            <th className="px-6 py-3 text-center">Add Notes</th>
                            <th className="px-6 py-3 text-center">Start Chat</th>
                            <th className="px-6 py-3 text-center">Delete User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                    {user.userName}
                                </td>
                                <td className="px-6 py-4 text-center">{user.email}</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => { setuId(user._id); navigate("/addNote"); }}>
                                        <MdAddCircle size={25} />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <IoChatbubbleEllipsesOutline size={25} className="cursor-pointer mx-auto" onClick={() => toggleModal(user)} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleUserDelete(user._id)}>
                                        <MdDelete color='red' size={25} className="mx-auto" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openModal && (
                <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                    <Modal.Header>Chat With {user.userName}</Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
                            <div className="p-4 overflow-y-auto space-y-3 max-h-[350px]">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-lg max-w-[70%] ${msg.userId_Sender === adminId
                                            ? "bg-green-100 self-end ml-auto text-right"
                                            : "bg-blue-100 self-start text-left"
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="p-4 flex mx-auto justify-center space-x-2 w-full">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full p-2 border rounded-lg"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            />
                            <button
                                className="p-2 bg-blue-500 text-white rounded-full"
                                onClick={sendMessage}
                            >
                                <IoSendOutline size={24} />
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
