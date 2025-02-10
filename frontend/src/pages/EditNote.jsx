import React, { useContext, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { noteValidation } from '../validation/userValidation';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CreateContext } from '../context/myContext';
import { toast } from 'react-toastify';

export default function EditNote() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(noteValidation),
    });

    const { AccessToken } = useContext(CreateContext);
    const navigate = useNavigate();
    const { id } = useParams(); 

    useEffect(() => {
        const getNote = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/note/getOneNote/${id}`, {
                    headers: { 'Authorization': `Bearer ${AccessToken}` }
                });

                if (res.data.success) {
                    const { title, content } = res.data.particularNote;
                    //set value is form hook method
                    setValue('title', title); // Update form values dynamically
                    setValue('content', content);
                }
            } catch (error) {
                console.error("Error fetching note:", error.message);
            }
        };

        if (id && AccessToken) {
            getNote();
        }
    }, [id, AccessToken, setValue]); 
    

    const handleEditNote = async (data) => {
        try {
            const res = await axios.put(`http://localhost:3000/note/updateNote/${id}`, data, {
                headers: { 'Authorization': `Bearer ${AccessToken}` }
            });

            if (res.data.success) {
                toast.success("Note updated successfully!");
                navigate('/notes');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update note");
            console.error("Error updating note:", error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <h1 className='mt-10 font-medium text-xl md:mt-14 md:text-2xl'>Edit Note</h1>

            <form onSubmit={handleSubmit(handleEditNote)}>
                <div className="max-w-xl mx-auto mt-16 flex flex-col border rounded-lg bg-white p-8">
                    <div className="mb-6">
                        <label htmlFor="title" className="text-sm font-semibold text-gray-600">Note Title</label>
                        <input
                            type="text"
                            id="title"
                            {...register('title')}
                            className="w-full rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                        <p className='text-xs text-red-600 font-semibold'>{errors.title?.message}</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="text-sm font-semibold text-gray-600">Note Content</label>
                        <textarea
                            id="content"
                            {...register('content')}
                            className="h-32 w-full resize-none rounded border border-gray-300 bg-white py-1 px-3 text-base leading-6 text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                        <p className='text-xs text-red-600 font-semibold'>{errors.content?.message}</p>
                    </div>

                    <button className="rounded mt-5 bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600" type='submit'>
                        Update Note
                    </button>
                </div>
            </form>
        </div>
    );
}



