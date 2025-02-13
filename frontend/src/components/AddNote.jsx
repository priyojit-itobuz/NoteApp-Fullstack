import React, { useContext } from 'react'
import Navbar from './Navbar'
import { noteValidation } from '../validation/userValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CreateContext } from '../context/myContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { useParams } from 'react-router-dom';

export default function AddNote() {

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(noteValidation),
    });

    const params = useParams();
    const id = params.id;
    const { isLoggedIn, Logout, AccessToken, user, setUser, Role } = useContext(CreateContext);

    // console.log("THIS IS ADDNOTE",isLoggedIn);


    // const token = AccessToken;
    const handleAddNote = async (data, e) => {

        try {
            console.log(data);
            // e.target.reset();
            const res = await axiosInstance.post("/note/addNote", data, {
                // headers: {'Authorization': `Bearer ${AccessToken}`}
            })
            if (res.data.success) {
                console.log(res.data)
                toast.success("Note Added SuccessFully");
                e.target.reset()
            }
        }

        catch (error) {
            toast.error(error.response.data.message)
            console.log(error.message);
        }


    }

    return (
        <div>
            <Navbar />
            <h1 className='mt-10 font-medium text-xl md:mt-14 md:text-2xl'>Add a Note</h1>

            <form onSubmit={handleSubmit(handleAddNote)}>
                <div className="max-w-xl mx-auto mt-16 flex w-full flex-col border rounded-lg bg-white p-8">
                    <div className="mb-6">
                        <label htmlFor="title" className="text-sm font-semibold leading-7 text-gray-600 mt-3">
                            Note Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            {...register('title')}
                            className="w-full rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                        <p className='text-xs text-red-600 font-semibold'>{errors.title?.message}</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="text-sm leading-7 font-semibold text-gray-600">
                            Note Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            {...register('content')}
                            className="h-32 w-full resize-none rounded border border-gray-300 bg-white py-1 px-3 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            defaultValue={""}
                        />
                        <p className='text-xs text-red-600 font-semibold'>{errors.content?.message}</p>
                    </div>

                    {/* Newly Added */}
                    {/* <div className="col-span-full">
                        <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Upload Image
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-300"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                        </div>
                    </div> */}

                    <button className="rounded border-0 mt-5 bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600 focus:outline-none" type='submit'>
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}
