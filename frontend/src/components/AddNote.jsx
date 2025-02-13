import React, { useContext } from 'react'
import Navbar from './Navbar'
import { noteValidation } from '../validation/userValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CreateContext } from '../context/myContext';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function AddNote() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(noteValidation),
    });

    const navigate = useNavigate();
    const { Role, uId, } = useContext(CreateContext);


    const handleAddNote = async (data, e) => {

        try {
            data.userId = uId;
            const res = await axiosInstance.post("/note/addNote", data, {})
            if (res.data.success) {
                console.log(res.data)
                toast.success("Note Added SuccessFully");
                e.target.reset()
                if (Role === 'admin') {
                    navigate("/admin")
                }
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
                    <button className="rounded border-0 mt-5 bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600 focus:outline-none" type='submit'>
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}
