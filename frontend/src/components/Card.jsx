import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { GrEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import { CreateContext } from '../context/myContext';

export default function Card({ title, content, id, setNotes, notes }) {
    const { AccessToken } = useContext(CreateContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleDelete() {
        try {
            const res = await axios.delete(`http://localhost:3000/note/deleteNote/${id}`, {
                headers: { 'Authorization': `Bearer ${AccessToken}` }
            });

            if (res.data.success) {
                toast.success("Note Deleted Successfully");
                setNotes(notes.filter(note => note._id !== id));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting note");
            console.error(error.message);
        }
    }

    return (
        <>
            {/* Card Component */}
            <div className="p-4 max-w-sm cursor-pointer">
                <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-white dark:text-white text-lg font-medium">
                            {title}
                        </h2>
                        <div className='flex gap-5'>
                            <Link to={`/edit/${id}`}>
                                <GrEdit className='text-white' size={20} />
                            </Link>
                            <MdDelete className='text-white cursor-pointer' size={20} onClick={handleDelete} />
                            <FaFileUpload className='text-white' size={20} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                        <p className="text-left text-base text-white dark:text-gray-300 line-clamp-3">
                            {content}
                        </p>
                        {/* Open Modal on Click */}
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="mt-3 text-black dark:text-white hover:text-blue-600 inline-flex items-center"
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
        </>
    );
}


// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { GrEdit } from "react-icons/gr";
// import { MdDelete } from "react-icons/md";
// import { FaFileUpload } from "react-icons/fa";
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { CreateContext } from '../context/myContext';

// export default function Card({ title, content, id, setNotes, notes }) {
//     const { AccessToken } = useContext(CreateContext);

//     async function handleDelete() {
//         try {
//             const res = await axios.delete(`http://localhost:3000/note/deleteNote/${id}`, {
//                 headers: { 'Authorization': `Bearer ${AccessToken}` }
//             });

//             if (res.data.success) {
//                 toast.success("Note Deleted Successfully");
//                 // Remove deleted note from state
//                 setNotes(notes.filter(note => note._id !== id));
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Error deleting note");
//             console.error(error.message);
//         }
//     }

//     return (
//         <div className="p-4 max-w-sm cursor-pointer">
//             <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
//                 <div className="flex justify-between items-center mb-3">
//                     <h2 className="text-white dark:text-white text-lg font-medium">
//                         {title}
//                     </h2>
//                     <div className='flex gap-5'>
//                         <Link to={`/edit/${id}`}>
//                             <GrEdit className='text-white' size={20} />
//                         </Link>
//                         <MdDelete className='text-white cursor-pointer' size={20} onClick={handleDelete} />
//                         <FaFileUpload className='text-white' size={20} />
//                     </div>
//                 </div>
//                 <div className="flex flex-col justify-between flex-grow">
//                     <p className="text-left text-base text-white dark:text-gray-300">
//                         {content}
//                     </p>
//                     <Link
//                         to="#"
//                         className="mt-3 text-black dark:text-white hover:text-blue-600 inline-flex items-center"
//                     >
//                         View Note
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }
