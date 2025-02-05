import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { yupResolver } from '@hookform/resolvers/yup';
import { noteValidation } from '../validation/userValidation';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CreateContext } from '../context/myContext';
import { toast } from 'react-toastify';

export default function EditNote() {

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(noteValidation),
    });

    const {AccessToken} = useContext(CreateContext);
    const[Title,setTitle] = useState('')
    const[Content,setContent] = useState('');
    const navigate = useNavigate();

    const params = useParams()
    const id = params.id
    console.log("note id",id);
    

    useEffect(()=>{
        const getNote = async() => {
            try {
                const res = await axios.get(`http://localhost:3000/note/getOneNote/${id}`, {
                    headers: {'Authorization': `Bearer ${AccessToken}`}
                })
                if(res.data.success) {
                    console.log("mytitle",res.data.particularNote.title);
                    
                    setTitle(res.data.particularNote.title)
                    setContent(res.data.particularNote.content)
                    console.log(res.data)
                }
            }
    
            catch (error) {
                console.log(error.message);    
            }
        }
        getNote();
    },[])


    

    // WIP : previous content not updating
    const handleEditNote = async (data, e) => {
        try {
            console.log(data);
            const res = await axios.put(`http://localhost:3000/note/updateNote/${id}`, data, {
                headers: {'Authorization': `Bearer ${AccessToken}`}
            })
            if(res.data.success) {
                console.log(res.data)
                toast.success("Note Updated SuccessFully");
                navigate('/')
            }
        }

        catch (error) {
            toast.error(error.response.data.message)
            console.log(error.message);    
        }
    }


  return (
    <div>
        <Navbar/>
        <h1 className='mt-10 font-medium text-xl md:mt-14 md:text-2xl'>Edit Note</h1>

            <form onSubmit={handleSubmit(handleEditNote)}>
                <div className="max-w-xl mx-auto mt-16 flex w-full flex-col border rounded-lg bg-white p-8">
                    <div className="mb-6">
                        <label htmlFor="title" className="text-sm font-semibold leading-7 text-gray-600 mt-3">
                            Note Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue = {Title}
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
                            defaultValue={Content}
                            {...register('content')}
                            className="h-32 w-full resize-none rounded border border-gray-300 bg-white py-1 px-3 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            
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
