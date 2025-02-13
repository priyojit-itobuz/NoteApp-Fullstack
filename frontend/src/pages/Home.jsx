import React, { useContext } from 'react'
import notes from '../assets/notes.jpg'
import { Button } from "flowbite-react";
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { CreateContext } from '../context/myContext';

export default function Home() {

    const { isLoggedIn } = useContext(CreateContext);

    return (
        <>
            <Navbar />
            <div className='mt-10'>
                <img src={notes} alt="note" className='w-[300px] mx-auto' />
                <h1 className='text-3xl md:text-6xl'>Your Go to NoteApp !</h1>
                <p className='mt-3 text-gray-600 break-all mx-auto md:w-[600px] md:mt-8'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis veritatis laborum illum laboriosam omnis a. Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, nulla!</p>
                {!isLoggedIn ? (<Link to="/signup"><Button outline gradientDuoTone="greenToBlue" className='mx-auto mt-10 '>
                    <p className='text-base md:text-xl'>Get Started</p>
                </Button></Link>) : (<></>)}

            </div>
        </>
    )
}

