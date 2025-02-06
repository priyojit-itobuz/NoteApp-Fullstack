import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { GrEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import { CreateContext } from '../context/myContext';
import ModalComponent from './Modal';

export default function Card({ title, content, id, setNotes, notes }) {
    const { AccessToken } = useContext(CreateContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    return (
        <>
            <div className="p-4 cursor-pointer">
                <div className="flex w-80 h-48 rounded-lg dark:bg-gray-800 bg-teal-400 shadow-md p-5 flex-col justify-between">
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
                            <FaFileUpload className="text-white hover:text-gray-300" size={20} />
                        </div>
                    </div>

                    <div className="flex-grow flex items-center justify-center">
                        {/* do ... feature */}
                        <p className="text-center text-xl text-white dark:text-gray-300 line-clamp-3 overflow-hidden">
                            {content}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm text-black dark:text-white font-medium hover:text-blue-600"
                        >
                            View Note
                        </button>
                    </div>
                </div>
            </div>



            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{title}</h2>
                        <p className="text-gray-700 dark:text-gray-300">{content}</p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {deleteModal && (<ModalComponent deleteModal={deleteModal} setDeleteModal={setDeleteModal} id={id} notes={notes} setNotes={setNotes} />)}
        </>
    );
}



