import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';
import { toast } from 'react-toastify';
import { Modal } from "flowbite-react";
import axiosInstance from '../utils/axiosInstance';
import { IoSend } from 'react-icons/io5';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000"); // Adjust the URL as necessary

export default function Navbar() {
    const [navbar, setNavbar] = useState(false);
    const { isLoggedIn, Logout, AccessToken, user, setUser , Role, adminId } = useContext(CreateContext);
    const [admins, setAdmins] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("accessToken") || '');
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const toggleDropdown = async () => {
        setIsOpen((prev) => !prev);
        try {
            const res = await axiosInstance.get("/admin/allAdmins");
            if (res.data.success) {
                setAdmins(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                socket.emit("join_room", adminId);
            }
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        if (AccessToken) {
            localStorage.setItem("accessToken", AccessToken);
            setToken(AccessToken);
        } else {
            localStorage.removeItem("accessToken");
            setToken('');
        }
    }, [AccessToken, isLoggedIn]);

    async function handleLogout() {
        try {
            const res = await axiosInstance.post("/logout");
            if (res.data.success) {
                toast.success(res.data.message);
                Logout();
                localStorage.removeItem("accessToken");
                setUser ('');
                setToken('');
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const toggleModal = (admin) => {
        setUserId(admin._id);
        setOpenModal(!openModal);
    };

    useEffect(() => {
        const fetchChatMessages = async () => {
            if (openModal && userId) {
                try {
                    const res = await axios.post("http://localhost:3000/chat/getChat", {
                        senderId: adminId,
                        receiverId: userId,
                    });
                    if (res.data.success) {
                        setMessages(res.data.data);
                    }
                } catch (error) {
                    console.error(error.message);
                }
            }
        };

        fetchChatMessages();
    }, [openModal, userId]);

    // useEffect(() => {
    //     // Listen for incoming messages
    //     socket.on("receiveMessage", (data) => {
    //         setMessages((prevMessages) => [
    //             ...prevMessages,
    //             { userId_Sender: data.senderId, message: data.message },
    //         ]);
    //     });

    //     return () => {
    //         socket.off("receiveMessage"); // Clean up the listener on unmount
    //     };
    // }, []);

    const sendMessage = async () => {
        if (!messageInput.trim()) return;
        const newMessage = {
            senderId: adminId,
            receiverId: userId,
            message: messageInput.trim(),
        };

        try {
            
            socket.emit("send_message", newMessage); // Emit the message to the server
            await axios.post("http://localhost:3000/chat/sendChat", newMessage);
            setMessages((prevMessages) => [
                ...prevMessages,
                { userId_Sender: adminId, message: messageInput.trim() },
            ]);
            setMessageInput("");
        } catch (error) {
            console.error("Error sending message:", error.message);
        }
    };

    return (
        <>
            <nav className="w-full">
                <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8 bg-purple-200">
                    <div>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                            <Link to="/">
                                <h2 className="text-2xl font-bold text-black border-0">NotesApp</h2>
                            </Link>
                            <div className="md:hidden">
                                <button
                                    className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                                    onClick={() => setNavbar(!navbar)}
                                >
                                    {navbar ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navbar Links */}
                    <div>
                        <div className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"}`}>
                            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                                <li className="text-white hover:text-indigo-200">
                                    <Link to="/" className="text-black">Home</Link>
                                </li>
                                {token && (
                                    <li className="text-white hover:text-indigo-200">
                                        <Link to="/notes" className="text-black">My Notes</Link>
                                    </li>
                                )}

                                {token && (
                                    <li className="text-white hover:text-indigo-200">
                                        <Link to="/profile" className="text-black">Profile</Link>
                                    </li>
                                )}

                                {token && (Role === 'admin' ?
                                    (
                                        <li className="text-white hover:text-indigo-200">
                                            <Link to="/admin" className="text-black">Admin</Link>
                                        </li>
                                    )
                                    :
                                    (<></>)
                                )}
                                {token && (Role !== 'admin' ?
                                    (
                                        <div className="relative inline-block">
                                            <button onClick={toggleDropdown}>Chat</button>
                                            {isOpen && (
                                                <div className="absolute left-0 bg-white border border-gray-300 rounded shadow-lg mt-1">
                                                    {admins?.map((admin, index) => {
                                                        return <button key={index} className="block w-[200px] text-left py-2 px-4 hover:bg-gray-100" onClick={() => toggleModal(admin)}>{admin.userName}</button>
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                    :
                                    (<></>)
                                )}
                            </ul>

                            {/* For Mobile */}
                            {!token ? (
                                <div className="mt-3 space-y-2 md:hidden">
                                    <Link to="/login" className="inline-block w-full px-4 py-2 text-center text-white bg-gray-600 rounded-md shadow hover:bg-gray-800">Sign in</Link>
                                    <Link to="/signup" className="inline-block w-full px-4 py-2 text-center text-gray-800 bg-white rounded-md shadow hover:bg-gray-100">Sign up</Link>
                                </div>
                            ) : (
                                <div className="flex gap-4 justify-center items-center mt-3 space-y-2 md:hidden">
                                    <div className='text-black flex'>
                                        Hi, <span className='text-green-600 uppercase font-semibold'>{user}</span>
                                    </div>
                                    <button className="inline-block w-full px-4 py-2 text-white text-center bg-gray-600 rounded-md shadow hover:bg-gray-800" onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* For Desktop: */}
                    {!token ? (
                        <div className="hidden space-x-2 md:inline-block">
                            <Link to="/login" className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800">Sign in</Link>
                            <Link to="/signup" className="px-4 py-2 text-gray-800 bg-white rounded-md shadow hover:bg-gray-100">Sign up</Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex gap-4 items-center">
                            <div className='text-black'>
                                Hi, <span className='text-green-600 uppercase font-semibold'>{user}</span>
                            </div>
                            <button className="px-4 py-2 text-white bg-gray-600 rounded-md shadow hover:bg-gray-800" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </nav>

            {openModal && <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Chat With {user.userName}</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="flex-grow p-4 overflow-y-auto space-y-3 max-h-[350px]">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded-lg max-w-[70%] ${msg.userId_Sender === userId
                                        ? "bg-blue-100 self-start text-left"
                                        : "bg-green-100 self-end ml-auto text-right"
                                    }`}
                                >
                                    {msg.message}
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="p-4 flex mx-auto justify-center space-x-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            size={80}
                            className="w-full p-2 border rounded-lg"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button
                            className="p-2 bg-blue-500 text-white rounded-full"
                            onClick={sendMessage}
                        >
                            <IoSend size={24} />
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>}
        </>
    );
}