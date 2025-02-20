import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { MdAddCircle } from "react-icons/md";
import { CreateContext } from '../context/myContext';
import { IoChatbubbleEllipsesOutline ,IoSend} from "react-icons/io5";
import { Button, Modal } from "flowbite-react";
import axios from 'axios';

export default function Admin() {

    const [users, setUsers] = useState([]);
    const { uId, setuId, adminId, setAdminId } = useContext(CreateContext);
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const navigate = useNavigate();


    async function getUsers() {
        try {
            const res = await axiosInstance.get("/admin/allUser")
            if (res.data.success) {
                setUsers(res.data.data)
            }
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getUsers();
    }, [])


    async function handleUserDelete(id) {
        try {
            const res = await axiosInstance.delete(`/admin/deleteUser/${id}`, {
            });
            if (res.data.success) {
                toast.success("User deleted successfully.");
                getUsers();
            } else {
                toast.error("Failed to delete User.");
            }
        } catch (error) {
            console.error("error");
        }
    }

    const toggleModal = async (user) => {
        setOpenModal(!openModal);
        setUser(user)
        if (!openModal) {
            try {
                const res = await axios.post("http://localhost:3000/chat/getChat", {
                    senderId: adminId,
                    receiverId: user._id,
                });
                if (res.data.success) {
                    console.log("my resp", res.data);

                    setMessages(res.data.data);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
    };

    const sendMessage = async () => {
        if (!messageInput.trim()) return;
        const newMessage = {
          senderId: adminId,
          receiverId: user._id,
          message: messageInput.trim(),
        };
        // socket.emit("sendMessage", newMessage);
    
        try {
          const res = await axios.post("http://localhost:3000/chat/sendChat", newMessage);
          if (res.data.success) {
            // Update messages state correctly
            setMessages((prevMessages) => [
              ...prevMessages,
              { userId_Sender: adminId, message: messageInput.trim() },
            ]);
            setMessageInput("");
          }
        } catch (error) {
          console.error("Error sending message:", error.message);
        }
      };


    return (
        <div>
            <Navbar />
            <h1 className='text-2xl mt-5 font-bold'>All Users</h1>
            <div className=" mt-5 relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                                User Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Add Notes
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Start Chat
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Delete User
                            </th>

                        </tr>
                    </thead>

                    {users.map((user, index) => {
                        return <tbody key={index}>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                    {user.userName}
                                </th>
                                <td className="px-6 py-4 text-center">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 cursor-pointer text-center">
                                    <button onClick={() => { setuId(user._id); navigate("/addNote") }} ><MdAddCircle size={25} /></button>
                                </td>
                                <td className="px-6 py-4">
                                    <IoChatbubbleEllipsesOutline size={25} className='cursor-pointer mx-auto' onClick={() => toggleModal(user)} />
                                </td>
                                <td className="px-6 py-4 cursor-pointer text-center" onClick={() => handleUserDelete(user._id)}>
                                    <MdDelete color='red' size={25} className='mx-auto' />
                                </td>

                            </tr>
                        </tbody>
                    })}
                </table>
            </div>

            {openModal && <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Chat With {user.userName}</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="flex-grow p-4 overflow-y-auto space-y-3 max-h-[350px]">
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
        </div>


    )
}


