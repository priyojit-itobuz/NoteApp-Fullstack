import React from 'react'
import Navbar from './Navbar'
import Card from './Card'
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const navigate = useNavigate();

    function handleAddNote() {
        navigate("/addNote")
    }

    return (
        <div>
            <Navbar />
            <div className='flex justify-between items-center'>
                <h1 className='mt-7 text-2xl font-semibold md:text-3xl md:mt-16'>All Notes</h1>
                <div className="w-fit p-3 flex justify-center mt-8 gap-3 items-center border border-black my-2 rounded-full dark:border-gray-200 dark:text-black md:mt-16 cursor-pointer hover:bg-slate-200" onClick={handleAddNote}>
                    <IoAddCircleSharp  size={30}/>
                    <h5 className="text-xl font-medium" >Add Note</h5>
                </div>
            </div>
            <div class="flex flex-wrap justify-center mt-10">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />

            </div>
        </div>
    )
}
