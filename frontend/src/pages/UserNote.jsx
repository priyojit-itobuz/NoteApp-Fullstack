import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { CreateContext } from '../context/myContext';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Card from '../components/Card';

export default function UserNote() {

    const { isLoggedIn,nId,setnId } = useContext(CreateContext);
    const [notes, setNotes] = useState([]);

    const params = useParams();
    const id = params.id;

    useEffect(() => {
      if (id) {
        localStorage.setItem("noteId",id)
        setnId(id);
        fetchUserNotes(id);
      }
    }, [id]);


    async function fetchUserNotes(nId) {
      
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
        <Navbar/>
      User Notes

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
