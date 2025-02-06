import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';
import axios from 'axios';
// import { useForm } from 'react-hook-form';

export default function Home() {
    const navigate = useNavigate();
    const { isLoggedIn, AccessToken } = useContext(CreateContext);
    const [notes, setNotes] = useState([]);
    const [query, setQuery] = useState({ 'searchText': '' });

    function handleAddNote() {
        navigate("/addNote");
    }

    async function searchNotes() {
        try {
            const res = await axios.post("http://localhost:3000/note/search", query, {
                headers: { 'Authorization': `Bearer ${AccessToken}`, 'Content-type': 'application/json' }
            });
            if (res.data.success) {
                
                console.log("searched", res.data);
                setNotes(res.data.notes)

                // const { title, content } = res.data.particularNote;
                //set value is form hook method
                // setValue('title', title); // Update form values dynamically
                // setValue('content', content);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        searchNotes()
    }, [query])



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


    //fix search functionality, on empty spaces should render all notes

    const handleInputChange = (e) => {
        const searchTerm = e.target.value;
        console.log(searchTerm);
        setQuery({ 'searchText': `${searchTerm}` })
    }

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

            {/* search */}

            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-lg">
                    <form className="mt-5 sm:flex sm:items-center">
                        <input
                            id="search"
                            name="search"
                            className="inline w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Search Notes"
                            type="search"
                            autofocus=""
                            onInput={handleInputChange}
                        />
                        {/* <button
                            type="submit"
                            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Search
                        </button> */}
                    </form>
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


