import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';
import axios from 'axios';

export default function Home() {

    const navigate = useNavigate();
    const { isLoggedIn, Logout, AccessToken, user, setUser } = useContext(CreateContext);
    const [notes, setNotes] = useState([])

    function handleAddNote() {
        navigate("/addNote")
    }


    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await axios.get("http://localhost:3000/note/oneNote", {
                    headers: { 'Authorization': `Bearer ${AccessToken}` }
                })

                if (res.data.success) {
                    console.log(res.data)
                    setNotes(res.data.data)
                    console.log("the notes", notes);
                }
            }

            catch (error) {
                console.log(error.message);
            }
        }
        fetchNotes()
    }, [isLoggedIn])

    return (
        <div>
            <Navbar />
            <div className='flex justify-between items-center'>
                <h1 className='mt-7 text-2xl font-semibold md:text-3xl md:mt-16'>All Notes</h1>
                <div className="w-fit p-3 flex justify-center mt-8 gap-3 items-center border border-black my-2 rounded-full dark:border-gray-200 dark:text-black md:mt-16 cursor-pointer hover:bg-slate-200" onClick={handleAddNote}>
                    <IoAddCircleSharp size={30} />
                    <h5 className="text-xl font-medium" >Add Note</h5>
                </div>
            </div>
            {isLoggedIn ? (<div  className="flex flex-wrap justify-center mt-10">
                {notes.map((note,index) => {
                return <Card title={note.title} content={note.content} key = {index} id={note._id}/>;
            })}
            </div>) : (<div></div>) }
        </div>
    )
}
