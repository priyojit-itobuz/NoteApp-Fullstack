import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { GrEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import { CreateContext } from '../context/myContext';
import ModalComponent from './Modal';
import { Button, Modal } from "flowbite-react";
import axiosInstance from '../utils/axiosInstance';

export default function Card({ title, content, id, setNotes, notes, pic, userName,fetchNotes }) {
    const { AccessToken, Role, setRole } = useContext(CreateContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [flag, setFlag] = useState(false);
    const [pics, setPics] = useState(pic);


    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        console.log("my filee", file);

        try {
            const formData = new FormData();
            formData.append("pic", file);
            const res = await axiosInstance.post(`/note/pic/${id}`, formData, { headers: { 'Authorization': `Bearer ${AccessToken}`, "Content-Type": "multipart/form-data" } });
            console.log("res", res);


            if (res.data.success) {
                console.log("myfile", res.data);
                console.log("img", res.data.data);
                setPics(res.data.data)
                localStorage.setItem(`pic/${title}`, res.data.data)
                toast.success("File uploaded successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload file");
            console.error("Error updating note:", error);
        }
    }

    function handleUpload() {
        setIsModalOpen(true);
        setFlag(true)
    }

    return (
        <>
            <div className="p-4 cursor-pointer">
                <div className="flex w-[300px] h-48 rounded-lg dark:bg-gray-800 bg-teal-400 shadow-md p-5 flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-white dark:text-white text-lg font-semibold truncate">
                            {title}
                        </h2>
                        <div className="flex gap-4">
                            <Link to={`/edit/${id}`}>
                                <GrEdit className="text-white hover:text-gray-300" size={20} />
                            </Link>

                            <MdDelete
                                className="text-white hover:text-red-500 cursor-pointer"
                                size={20}
                                onClick={() => setDeleteModal(true)}
                            />
                            <FaFileUpload className="text-white hover:text-gray-300" size={20} onClick={handleUpload} />


                        </div>
                    </div>

                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-center text-xl text-white dark:text-gray-300 line-clamp-3 overflow-hidden">
                            {/* {content} */}
                            {content.length > 22 ? content.substring(0, 22) + "..." : content}
                            {/* {content.substring(0, 22) + "..."} */}
                        </p>
                    </div>

                    {Role === 'user'?(<div className="flex justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm text-black dark:text-white font-medium hover:text-blue-600"
                        >
                            View Note
                        </button>
                    </div>):(<div className="flex justify-between">
                        <p className='text-sm'>Author: {userName}</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm text-black dark:text-white font-medium hover:text-blue-600"
                        >
                            View Note
                        </button>
                    </div>)}

                    {/* <div className="flex justify-between">
                        <p className='text-sm'>Author: {userName}</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm text-black dark:text-white font-medium hover:text-blue-600"
                        >
                            View Note
                        </button>
                    </div> */}
                </div>
            </div>

            {isModalOpen && (
                <div>
                    <Modal
                        show={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setFlag(false);
                        }}
                    >
                        <Modal.Header>{flag === false ? `Note Title : ${title}` : "Upload Image"}</Modal.Header>
                        <Modal.Body>
                            <div className="space-y-6 p-6">
                                <p>{flag === true ? (<input type='file' accept=".png, .jpg, .jpeg, .txt" onChange={handleFileUpload} />) : (<></>)}</p>
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 break-all">
                                    {flag === false ? content : (<img src={`http://localhost:3000/uploads/${localStorage.getItem(`pic/${title}`)}`} alt={pics} />)}
                                </p>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => {
                                setIsModalOpen(false);
                                setFlag(false);
                            }}>Close</Button>

                        </Modal.Footer>
                    </Modal>
                </div>
            )}


            {deleteModal && (<ModalComponent deleteModal={deleteModal} setDeleteModal={setDeleteModal} id={id} notes={notes} setNotes={setNotes} fetchNotes={fetchNotes} />)}
        </>
    );
}



