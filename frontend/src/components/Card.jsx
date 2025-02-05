import React from 'react'
import { Link } from 'react-router-dom'
import { GrEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

export default function Card() {
    return (
        <div>
            <div className="p-4 max-w-sm cursor-pointer ">
                <div className="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-white dark:text-white text-lg font-medium">
                            Title 
                        </h2>
                        <div className='flex gap-5'>
                            <GrEdit className='text-white' size={20}/>
                            <MdDelete className='text-white' size={20}/>
                            <FaFileUpload className='text-white' size={20}/>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                        <p className="text-left text-base text-white dark:text-gray-300">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores dolore aperiam pariatur illum deleniti iusto culpa qui ut quam doloribus?
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
