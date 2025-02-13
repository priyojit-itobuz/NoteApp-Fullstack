


import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { CreateContext } from '../context/myContext';
import axiosInstance from '../utils/axiosInstance';

export default function Notes() {
  const navigate = useNavigate();
  const { isLoggedIn, Role } = useContext(CreateContext);

  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Number of notes per page

  // Debouncing the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 300ms delay

    return () => clearTimeout(timer); // Clear timeout on component unmount or searchText change
  }, [searchText]);

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

  // Handle sorting change
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split("-");
    setSortField(field);
    setSortOrder(order);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchNotes(page);
    }
  };

  // Fetch notes when dependencies change
  useEffect(() => {
    fetchNotes(currentPage);
  }, [isLoggedIn, debouncedSearchText, sortField, sortOrder, currentPage]);

  return (
    <div>
      <Navbar />
      <div className="flex justify-between items-center">
        <h1 className="mt-7 text-2xl font-semibold md:text-3xl md:mt-16">All Notes</h1>


        {Role === 'user' ? (<div
          className="w-fit p-3 flex justify-center mt-8 gap-3 items-center border border-black my-2 rounded-full dark:border-gray-200 dark:text-black md:mt-16 cursor-pointer hover:bg-slate-200"
          onClick={() => navigate("/addNote")}>
          <IoAddCircleSharp size={30} />
          <h5 className="text-xl font-medium">Add Note</h5>
        </div>):(<></>)}
        


      </div>

      {/* Search Bar */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <input
            id="search"
            name="search"
            className="inline w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search Notes by Title"
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Sorting */}
      <div className="flex justify-center mb-6">
        <label htmlFor="sort" className="flex justify-center items-center mr-2 text-medium font-medium">Sort By</label>
        <select
          className="border border-gray-300 rounded-md p-2"
          onChange={handleSortChange}
          value={`${sortField}-${sortOrder}`}
        >
          <option value="title-asc">Title-Asc</option>
          <option value="title-desc">Title-Desc</option>
          <option value="content-asc">Content-Asc</option>
          <option value="content-desc">Content-Desc</option>
        </select>
      </div>

      {isLoggedIn ? (
        notes.length > 0 ? (
          <div className="flex flex-wrap justify-center mt-10">
            {notes.map((note) => (
              <Card
                title={note.title}
                userName={note.userId.userName}
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

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-1">
        <button
          type="button"
          className="px-1 py-2 text-sm font-medium md:px-4 md:py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="px-3 py-1 md:px-4 md:py-2">Page {currentPage} of {totalPages}</span>

        <button
          type="button"
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}









