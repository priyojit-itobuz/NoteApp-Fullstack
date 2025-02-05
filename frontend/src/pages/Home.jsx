import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';
import axios from 'axios';

export default function Home() {
    const navigate = useNavigate();
    const { isLoggedIn, AccessToken } = useContext(CreateContext);
    const [notes, setNotes] = useState([]);

    function handleAddNote() {
        navigate("/addNote");
    }

    useEffect(() => {
        const fetchNotes = async () => {
            if (!AccessToken) return; // Prevent API call if there's no token

            try {
                const res = await axios.get("http://localhost:3000/note/oneNote", {
                    headers: { 'Authorization': `Bearer ${AccessToken}` }
                });

                if (res.data.success) {
                    console.log("Fetched notes:", res.data.data);
                    setNotes(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching notes:", error.message);
            }
        };

        fetchNotes();
    }, [isLoggedIn, AccessToken]); // Added AccessToken to dependencies

    return (
        <div>
            <Navbar />
            <div className='flex justify-between items-center'>
                <h1 className='mt-7 text-2xl font-semibold md:text-3xl md:mt-16'>All Notes</h1>
                <div className="w-fit p-3 flex justify-center mt-8 gap-3 items-center border border-black my-2 rounded-full dark:border-gray-200 dark:text-black md:mt-16 cursor-pointer hover:bg-slate-200" onClick={handleAddNote}>
                    <IoAddCircleSharp size={30} />
                    <h5 className="text-xl font-medium">Add Note</h5>
                </div>
            </div>

            {isLoggedIn ? (
                notes.length > 0 ? (
                    <div className="flex flex-wrap justify-center mt-10">
                        {notes.map((note, index) => (
                            <Card title={note.title} content={note.content} key={note._id} id={note._id} setNotes={setNotes} 
                            notes={notes} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center mt-10 text-gray-500">No notes found. Add a new note!</p>
                )
            ) : (
                <p className="text-center mt-10 text-red-500 font-semibold">Please log in to view your notes.</p>
            )}
        </div>
    );
}


// import React, { useContext, useEffect, useState } from 'react'
// import Navbar from '../components/Navbar'
// import Card from '../components/Card'
// import { IoAddCircleSharp } from "react-icons/io5";
// import { useNavigate } from 'react-router-dom';
// import { CreateContext } from '../context/myContext';
// import axios from 'axios';

// export default function Home() {

//     const navigate = useNavigate();
//     const { isLoggedIn, Logout, AccessToken, user, setUser } = useContext(CreateContext);
//     const [notes, setNotes] = useState([])

//     function handleAddNote() {
//         navigate("/addNote")
//     }


//     useEffect(() => {
//         const fetchNotes = async () => {
//             try {
//                 const res = await axios.get("http://localhost:3000/note/oneNote", {
//                     headers: { 'Authorization': `Bearer ${AccessToken}` }
//                 })

//                 if (res.data.success) {
//                     console.log(res.data)
//                     setNotes(res.data.data)
//                     console.log("the notes", notes);
//                 }
//             }

//             catch (error) {
//                 console.log(error.message);
//             }
//         }
//         fetchNotes()
//     }, [isLoggedIn])

//     return (
//         <div>
//             <Navbar />
//             <div className='flex justify-between items-center'>
//                 <h1 className='mt-7 text-2xl font-semibold md:text-3xl md:mt-16'>All Notes</h1>
//                 <div className="w-fit p-3 flex justify-center mt-8 gap-3 items-center border border-black my-2 rounded-full dark:border-gray-200 dark:text-black md:mt-16 cursor-pointer hover:bg-slate-200" onClick={handleAddNote}>
//                     <IoAddCircleSharp size={30} />
//                     <h5 className="text-xl font-medium" >Add Note</h5>
//                 </div>
//             </div>
//             {isLoggedIn ? (<div  className="flex flex-wrap justify-center mt-10">
//                 {notes.map((note,index) => {
//                 return <Card title={note.title} content={note.content} key = {index} id={note._id}/>;
//             })}
//             </div>) : (<div></div>) }
//         </div>
//     )
// }
