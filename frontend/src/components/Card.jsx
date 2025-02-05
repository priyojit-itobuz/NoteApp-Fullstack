import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GrEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import { CreateContext } from '../context/myContext';

export default function Card({title,content,id}) {


    const {AccessToken,isLoggedIn} = useContext(CreateContext);

    // WIP : AFTER DELETE WE NEED TO REFRESH TO GET UPDATED NOTES
    async function handleDelete() 
    {
        try {
            const res = await axios.delete(`http://localhost:3000/note/deleteNote/${id}`, {
                headers: {'Authorization': `Bearer ${AccessToken}`}
            })
            if(res.data.success) {
                console.log(res.data)
                toast.success("Note Deleted SuccessFully");
                e.target.reset()
            }
        }

        catch (error) {
            toast.error(error.response.data.message)
            console.log(error.message);    
        }
    }   

    // useEffect(() => {
    //     const fetchNotes = async () => {
    //         try {
    //             const res = await axios.get("http://localhost:3000/note/oneNote", {
    //                 headers: { 'Authorization': `Bearer ${AccessToken}` }
    //             })

    //             if (res.data.success) {
    //                 console.log(res.data)
    //                 setNotes(res.data.data)
    //                 console.log("the notes", notes);
    //             }
    //         }

    //         catch (error) {
    //             console.log(error.message);
    //         }
    //     }
    //     fetchNotes()
    // }, [])

    return (
        <div>
            <div className="p-4 max-w-sm cursor-pointer ">
                <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-white dark:text-white text-lg font-medium">
                            {title}
                        </h2>
                        <div className='flex gap-5'>
                            <Link to={`/edit/${id}`} >
                                <GrEdit className='text-white' size={20}/>
                            </Link>
                            <MdDelete className='text-white' size={20} onClick={handleDelete}/>
                            {/* <input type="file" /> */}
                            <FaFileUpload className='text-white' size={20} type='file'/>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                        <p className="text-left text-base text-white dark:text-gray-300">
                           {content}
                        </p>
                        <Link
                            to="#"
                            className="mt-3 text-black dark:text-white hover:text-blue-600 inline-flex items-center"
                        >
                            View Note                            
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}
