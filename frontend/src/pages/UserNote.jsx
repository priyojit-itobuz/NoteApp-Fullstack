import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { CreateContext } from '../context/myContext';

export default function UserNote() {

    const { isLoggedIn } = useContext(CreateContext);
    const [notes, setNotes] = useState([]);

    async function fetchNotes(page = 1) {
        try {
          const res = await axiosInstance.post(
            `/note/searchSortPaginate?sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`,
            { searchText: debouncedSearchText }
          );
    
          if (res.data.success) {
            setNotes(res.data.notes);
            setCurrentPage(res.data.pagination.currentPage);
            setTotalPages(Math.max(1, res.data.pagination.totalPages));
          }
        } catch (error) {
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
                fetchNotes={fetchNotes}
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
