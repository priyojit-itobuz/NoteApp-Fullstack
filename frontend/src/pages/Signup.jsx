import React, { useState } from 'react'
import { yupResolver } from "@hookform/resolvers/yup";
import { signupUser } from '../validation/userValidation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signupUser),
    });

    const [seePassword, seeSetPassword] = useState(false)

    const handleRegistration = async (data, e) => {
        try {
            const res = await axios.post("http://localhost:3000/register", data, {
                headers: { 'Content-type': 'application/json' },
            });

            if (res.data.success) {
                toast.success(res.data.message);
                e.target.reset();
            }
        } catch (error) {
            if(error.status === 429)
            {
                toast.error("Too Many Request, Please Try Later")
            }
            else
            {
                toast.error(error.response?.data?.error || "Something went wrong");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-3 py-4 mx-auto lg:py-0">
            <div className="w-full bg-white rounded-lg shadow border sm:max-w-md xl:p-0">
                <div className="p-6 space-y-6 md:space-y-6 sm:p-8">
                    <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Create an account
                    </p>
                    <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-900">Your Name</label>
                            <input
                                placeholder="Please Enter Name"
                                {...register('userName')}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2"
                                type="text"
                            />
                            <p className="text-xs text-red-600 font-semibold min-h-[16px]">{errors.userName?.message}</p>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-900">Your Email</label>
                            <input
                                placeholder="abc@123"
                                {...register('email')}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2"
                                type="email"
                            />
                            <p className="text-xs text-red-600 font-semibold min-h-[16px]">{errors.email?.message}</p>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-900">Your Password</label>
                            <div className='w-100 relative'>
                                {seePassword ? (<><span className='flex justify-center items-center absolute h-100 top-[6px] right-3 cursor-pointer' onClick={() => seeSetPassword(false)}><IoMdEye size={25} /></span>
                                    <input
                                        placeholder="••••••••"
                                        {...register('password')}
                                        className="block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2"
                                        type="text"
                                    /></>) : (<><span className='flex justify-center items-center absolute h-100 top-[6px]  right-3 cursor-pointer' onClick={() => seeSetPassword(true)}><IoMdEyeOff size={25} /></span>
                                        <input
                                            placeholder="••••••••"
                                            {...register('password')}
                                            className="block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2"
                                            type="password"
                                        /></>)}
                            </div>
                            <p className="text-xs text-red-600 font-semibold min-h-[16px]">{errors.password?.message}</p>
                        </div>
                        <p>
                            Already have an account? <Link to="/login" className="text-blue-500 underline">Login</Link>
                        </p>
                        <button
                            className="w-full bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-white"
                            type="submit"
                        >
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}





