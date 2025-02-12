import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { CreateContext } from '../context/myContext';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Card from '../components/Card';
import { IoAddCircleSharp } from "react-icons/io5";

export default function UserNote() {

  const { isLoggedIn, nId, setnId } = useContext(CreateContext);
  const [notes, setNotes] = useState([]);

  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      localStorage.setItem("noteId", id)
      setnId(id);
      fetchUserNotes(id);
    }
  }, [id]);


  async function fetchUserNotes(id) {

    try {
      const res = await axiosInstance.get(`/admin/particularNote/${localStorage.getItem("noteId")}`);

      if (res.data.success) {
        setNotes(res.data.data);
      } else {
        console.log("No notes found");
        setNotes([])
      }
    } catch (error) {
      setNotes([])
      console.error("Error fetching notes:", error.message);
    }
  }


  return (
    <div>
      <Navbar />
      <div className="flex justify-between items-center">
        <h1 className="mt-7 text-2xl font-semibold md:text-3xl md:mt-16">All Notes</h1>
        <div
          className="w-fit p-3 flex justify-center mt-8 gap-3 items-center border border-black my-2 rounded-full dark:border-gray-200 dark:text-black md:mt-16 cursor-pointer hover:bg-slate-200"
          onClick={() => navigate(`/admin/addNote/${id}`)}
        >
          <IoAddCircleSharp size={30} />
          <h5 className="text-xl font-medium">Add Note</h5>
        </div>
      </div>

      {isLoggedIn ? (
        notes.length > 0 ? (
          <div className="flex flex-wrap justify-center mt-10">
            {notes.map((note) => (
              <Card
                title={note.title}
                content={note.content}
                key={note._id}
                id={note._id}
                pic={note.pic}
                setNotes={setNotes}
                notes={notes}
                fetchUserNotes={fetchUserNotes}
              />
            ))}
          </div>
        ) : (
          <p className="text-center mt-10 text-gray-500">No notes found. Add a new note!</p>
        )
      ) : (
        <p className="text-center mt-10 text-red-500 font-semibold">Please log in to view your notes.</p>
      )}
    </div>
  )
}
